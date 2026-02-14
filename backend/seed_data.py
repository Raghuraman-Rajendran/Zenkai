import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_data():
    # Products
    products = [
        {
            "id": "ceremonial-matcha",
            "name": "Ceremonial Grade Matcha",
            "description": "Premium first-harvest matcha from Uji, Japan. Vibrant green color with smooth, umami-rich flavor. Perfect for traditional tea ceremonies and daily meditation rituals.",
            "price": 2499.00,
            "category": "matcha",
            "image_url": "https://images.unsplash.com/photo-1753009712870-a40156af0b6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwyfHxjZXJlbW9uaWFsJTIwbWF0Y2hhJTIwcG93ZGVyJTIwYm93bCUyMHdoaXNrfGVufDB8fHx8MTc3MTA2NzIyNXww&ixlib=rb-4.1.0&q=85",
            "stock": 100,
            "features": ["100% Organic", "First Harvest", "Stone Ground", "30g Tin", "Direct from Uji"]
        },
        {
            "id": "daily-matcha",
            "name": "Daily Ritual Matcha",
            "description": "Second harvest matcha perfect for lattes and daily use. Rich in antioxidants with a balanced, slightly sweet flavor profile.",
            "price": 1499.00,
            "category": "matcha",
            "image_url": "https://images.unsplash.com/photo-1753009712810-3f72c3f72548?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxjZXJlbW9uaWFsJTIwbWF0Y2hhJTIwcG93ZGVyJTIwYm93bCUyMHdoaXNrfGVufDB8fHx8MTc3MTA2NzIyNXww&ixlib=rb-4.1.0&q=85",
            "stock": 100,
            "features": ["Organic", "Great for Lattes", "50g Pouch", "Sustainable Packaging"]
        },
        {
            "id": "starter-kit",
            "name": "Matcha Starter Kit",
            "description": "Everything you need to start your matcha journey. Includes bamboo whisk, ceramic bowl, bamboo scoop, and 30g ceremonial matcha.",
            "price": 3999.00,
            "category": "accessories",
            "image_url": "https://images.unsplash.com/photo-1697914584292-9ffae541f5ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHx3b21hbiUyMGRyaW5raW5nJTIwbWF0Y2hhJTIwbGF0dGUlMjBtaW5pbWFsaXN0JTIwYWVzdGhldGljfGVufDB8fHx8MTc3MTA2NzIyNnww&ixlib=rb-4.1.0&q=85",
            "stock": 50,
            "features": ["Bamboo Whisk", "Ceramic Bowl", "Bamboo Scoop", "30g Matcha", "Guide Included"]
        },
        {
            "id": "bamboo-whisk",
            "name": "Bamboo Whisk (Chasen)",
            "description": "Handcrafted 100-prong bamboo whisk for creating the perfect frothy matcha. Essential tool for traditional preparation.",
            "price": 899.00,
            "category": "accessories",
            "image_url": "https://images.unsplash.com/photo-1753009712810-3f72c3f72548?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxjZXJlbW9uaWFsJTIwbWF0Y2hhJTIwcG93ZGVyJTIwYm93bCUyMHdoaXNrfGVufDB8fHx8MTc3MTA2NzIyNXww&ixlib=rb-4.1.0&q=85",
            "stock": 80,
            "features": ["Handcrafted", "100 Prongs", "Natural Bamboo", "Authentic Japanese"]
        }
    ]
    
    await db.products.delete_many({})
    for product in products:
        product['created_at'] = datetime.now(timezone.utc).isoformat()
        await db.products.insert_one(product)
    print(f"Seeded {len(products)} products")
    
    # Blog Posts
    blog_posts = [
        {
            "id": "what-is-matcha",
            "title": "What is Matcha?",
            "slug": "what-is-matcha",
            "content": "Matcha is a finely ground powder made from specially grown green tea leaves. Unlike regular tea, matcha involves consuming the entire leaf, providing maximum nutritional benefits. The leaves are shade-grown for 3-4 weeks before harvest, which increases chlorophyll production and gives matcha its vibrant green color.",
            "excerpt": "Discover the ancient Japanese tradition of matcha and why it's the ultimate superfood for modern wellness.",
            "category": "education",
            "image_url": "https://images.unsplash.com/photo-1766485586335-b3ecea463aa6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwzfHxncmVlbiUyMHRlYSUyMHBsYW50YXRpb24lMjBmb2d8ZW58MHx8fHwxNzcxMDY3MjM3fDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "matcha-vs-coffee",
            "title": "Matcha vs Coffee: The Energy Face-Off",
            "slug": "matcha-vs-coffee",
            "content": "While coffee provides a quick energy spike followed by a crash, matcha offers sustained energy thanks to L-theanine. This amino acid works with caffeine to provide calm, focused energy for 4-6 hours without jitters or crashes. Matcha contains less caffeine than coffee but delivers more stable alertness.",
            "excerpt": "Why matcha provides superior energy compared to your morning coffee.",
            "category": "wellness",
            "image_url": "https://images.unsplash.com/photo-1697914584292-9ffae541f5ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHx3b21hbiUyMGRyaW5raW5nJTIwbWF0Y2hhJTIwbGF0dGUlMjBtaW5pbWFsaXN0JTIwYWVzdGhldGljfGVufDB8fHx8MTc3MTA2NzIyNnww&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "how-to-make-matcha-latte",
            "title": "How to Make the Perfect Matcha Latte",
            "slug": "how-to-make-matcha-latte",
            "content": "Start with 1-2 teaspoons of matcha powder. Add 60ml of hot water (75-80°C). Whisk vigorously in a zigzag motion until frothy. Heat 200ml of your favorite milk. Pour milk over matcha. Optionally add sweetener. Enjoy your café-quality matcha latte at home.",
            "excerpt": "Master the art of creating café-quality matcha lattes in your own kitchen.",
            "category": "recipes",
            "image_url": "https://images.unsplash.com/photo-1753009712810-3f72c3f72548?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxjZXJlbW9uaWFsJTIwbWF0Y2hhJTIwcG93ZGVyJTIwYm93bCUyMHdoaXNrfGVufDB8fHx8MTc3MTA2NzIyNXww&ixlib=rb-4.1.0&q=85"
        }
    ]
    
    await db.blog_posts.delete_many({})
    for post in blog_posts:
        post['created_at'] = datetime.now(timezone.utc).isoformat()
        await db.blog_posts.insert_one(post)
    print(f"Seeded {len(blog_posts)} blog posts")
    
    # Sample Reviews
    reviews = [
        {
            "id": "review-1",
            "product_id": "ceremonial-matcha",
            "customer_name": "Priya Sharma",
            "rating": 5,
            "comment": "Absolutely love this matcha! The quality is exceptional and the taste is so smooth. My morning ritual is complete."
        },
        {
            "id": "review-2",
            "product_id": "ceremonial-matcha",
            "customer_name": "Arjun Mehta",
            "rating": 5,
            "comment": "Best matcha I've tried in India. Authentic Japanese quality. Worth every rupee."
        },
        {
            "id": "review-3",
            "product_id": "daily-matcha",
            "customer_name": "Sneha Desai",
            "rating": 4,
            "comment": "Great for daily lattes. Good value for money and tastes delicious with oat milk."
        }
    ]
    
    await db.reviews.delete_many({})
    for review in reviews:
        review['created_at'] = datetime.now(timezone.utc).isoformat()
        await db.reviews.insert_one(review)
    print(f"Seeded {len(reviews)} reviews")
    
    print("Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_data())
