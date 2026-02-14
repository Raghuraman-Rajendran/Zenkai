from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import razorpay
import hmac
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_key_id = os.environ.get('RAZORPAY_KEY_ID', 'test_key')
razorpay_key_secret = os.environ.get('RAZORPAY_KEY_SECRET', 'test_secret')
razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int = 100
    features: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    items: List[CartItem] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    address: str
    city: str
    state: str
    pincode: str
    items: List[CartItem]
    total_amount: float

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    address: str
    city: str
    state: str
    pincode: str
    items: List[CartItem]
    total_amount: float
    payment_status: str = "pending"
    order_status: str = "processing"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RazorpayOrderCreate(BaseModel):
    amount: float
    order_id: str

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: str

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    customer_name: str
    rating: int
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    product_id: str
    customer_name: str
    rating: int
    comment: str

class Subscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_email: str
    customer_name: str
    plan: str
    frequency: str
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SubscriptionCreate(BaseModel):
    customer_email: str
    customer_name: str
    plan: str
    frequency: str

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str
    excerpt: str
    category: str
    image_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmailCapture(BaseModel):
    email: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Zenkai Matcha API"}

# Products
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product

# Cart
@api_router.get("/cart/{session_id}", response_model=Cart)
async def get_cart(session_id: str):
    cart = await db.carts.find_one({"session_id": session_id}, {"_id": 0})
    if not cart:
        cart = Cart(session_id=session_id, items=[])
        cart_dict = cart.model_dump()
        cart_dict['created_at'] = cart_dict['created_at'].isoformat()
        await db.carts.insert_one(cart_dict)
    else:
        if isinstance(cart.get('created_at'), str):
            cart['created_at'] = datetime.fromisoformat(cart['created_at'])
    return cart if cart else Cart(session_id=session_id, items=[])

@api_router.post("/cart/{session_id}/add")
async def add_to_cart(session_id: str, item: CartItem):
    cart = await db.carts.find_one({"session_id": session_id})
    if not cart:
        cart = Cart(session_id=session_id, items=[item])
        cart_dict = cart.model_dump()
        cart_dict['created_at'] = cart_dict['created_at'].isoformat()
        await db.carts.insert_one(cart_dict)
    else:
        items = cart.get('items', [])
        found = False
        for i, existing_item in enumerate(items):
            if existing_item['product_id'] == item.product_id:
                items[i]['quantity'] += item.quantity
                found = True
                break
        if not found:
            items.append(item.model_dump())
        await db.carts.update_one(
            {"session_id": session_id},
            {"$set": {"items": items}}
        )
    return {"message": "Item added to cart"}

@api_router.delete("/cart/{session_id}/remove/{product_id}")
async def remove_from_cart(session_id: str, product_id: str):
    cart = await db.carts.find_one({"session_id": session_id})
    if cart:
        items = [item for item in cart.get('items', []) if item['product_id'] != product_id]
        await db.carts.update_one(
            {"session_id": session_id},
            {"$set": {"items": items}}
        )
    return {"message": "Item removed from cart"}

@api_router.put("/cart/{session_id}/update/{product_id}")
async def update_cart_quantity(session_id: str, product_id: str, quantity: int):
    cart = await db.carts.find_one({"session_id": session_id})
    if cart:
        items = cart.get('items', [])
        for item in items:
            if item['product_id'] == product_id:
                item['quantity'] = quantity
                break
        await db.carts.update_one(
            {"session_id": session_id},
            {"$set": {"items": items}}
        )
    return {"message": "Cart updated"}

@api_router.delete("/cart/{session_id}")
async def clear_cart(session_id: str):
    await db.carts.delete_one({"session_id": session_id})
    return {"message": "Cart cleared"}

# Orders
@api_router.post("/orders/create", response_model=Order)
async def create_order(order_data: OrderCreate):
    order_number = f"ZM{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    order = Order(
        order_number=order_number,
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        address=order_data.address,
        city=order_data.city,
        state=order_data.state,
        pincode=order_data.pincode,
        items=order_data.items,
        total_amount=order_data.total_amount
    )
    order_dict = order.model_dump()
    order_dict['created_at'] = order_dict['created_at'].isoformat()
    await db.orders.insert_one(order_dict)
    return order

@api_router.post("/orders/create-razorpay-order")
async def create_razorpay_order(data: RazorpayOrderCreate):
    try:
        razorpay_order = razorpay_client.order.create({
            "amount": int(data.amount * 100),
            "currency": "INR",
            "payment_capture": 1
        })
        await db.orders.update_one(
            {"id": data.order_id},
            {"$set": {"razorpay_order_id": razorpay_order["id"]}}
        )
        return {
            "razorpay_order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/orders/verify-payment")
async def verify_payment(data: PaymentVerification):
    try:
        signature = hmac.new(
            razorpay_key_secret.encode(),
            f"{data.razorpay_order_id}|{data.razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature == data.razorpay_signature:
            await db.orders.update_one(
                {"id": data.order_id},
                {"$set": {
                    "payment_status": "paid",
                    "razorpay_payment_id": data.razorpay_payment_id,
                    "order_status": "confirmed"
                }}
            )
            return {"message": "Payment verified successfully"}
        else:
            raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    return order

# Reviews
@api_router.get("/reviews/{product_id}", response_model=List[Review])
async def get_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).to_list(100)
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate):
    review = Review(**review_data.model_dump())
    review_dict = review.model_dump()
    review_dict['created_at'] = review_dict['created_at'].isoformat()
    await db.reviews.insert_one(review_dict)
    return review

# Subscriptions
@api_router.post("/subscriptions", response_model=Subscription)
async def create_subscription(sub_data: SubscriptionCreate):
    subscription = Subscription(**sub_data.model_dump())
    sub_dict = subscription.model_dump()
    sub_dict['created_at'] = sub_dict['created_at'].isoformat()
    await db.subscriptions.insert_one(sub_dict)
    return subscription

@api_router.get("/subscriptions/{email}")
async def get_subscriptions(email: str):
    subs = await db.subscriptions.find({"customer_email": email}, {"_id": 0}).to_list(100)
    for sub in subs:
        if isinstance(sub.get('created_at'), str):
            sub['created_at'] = datetime.fromisoformat(sub['created_at'])
    return subs

# Blog
@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    posts = await db.blog_posts.find({}, {"_id": 0}).to_list(100)
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
    return posts

@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if isinstance(post.get('created_at'), str):
        post['created_at'] = datetime.fromisoformat(post['created_at'])
    return post

# Email Capture
@api_router.post("/email-capture")
async def capture_email(data: EmailCapture):
    await db.email_list.insert_one({"email": data.email, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"message": "Email captured successfully"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
