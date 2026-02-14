import requests
import sys
from datetime import datetime
import json

class ZenkaiMatchaAPITester:
    def __init__(self, base_url="https://zenkai-matcha.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = f"test_session_{datetime.now().strftime('%Y%m%d%H%M%S')}"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.text:
                    try:
                        resp_json = response.json()
                        if isinstance(resp_json, list):
                            print(f"   Response: {len(resp_json)} items")
                        else:
                            print(f"   Response keys: {list(resp_json.keys()) if isinstance(resp_json, dict) else 'Non-dict response'}")
                    except:
                        print(f"   Response length: {len(response.text)} chars")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Error: {response.text[:200]}...")

            return success, response.json() if response.text and success else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root(self):
        """Test root endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_products(self):
        """Test products endpoints"""
        print("\n=== TESTING PRODUCTS ===")
        
        # Get all products
        success, products = self.run_test("Get All Products", "GET", "products", 200)
        product_id = None
        
        if success and products:
            product_id = products[0].get('id')
            print(f"   Found {len(products)} products, first product ID: {product_id}")
        
        # Test category filtering
        self.run_test("Filter Products by Matcha", "GET", "products?category=matcha", 200)
        self.run_test("Filter Products by Accessories", "GET", "products?category=accessories", 200)
        
        # Test single product
        if product_id:
            self.run_test("Get Single Product", "GET", f"products/{product_id}", 200)
        
        # Test non-existent product
        self.run_test("Get Non-existent Product", "GET", "products/non-existent-id", 404)
        
        return success, product_id

    def test_cart(self, product_id):
        """Test cart endpoints"""
        print("\n=== TESTING CART ===")
        
        if not product_id:
            print("❌ Skipping cart tests - no product ID available")
            return False
        
        # Get cart (should create if doesn't exist)
        cart_success, cart = self.run_test("Get Cart", "GET", f"cart/{self.session_id}", 200)
        
        # Add to cart
        cart_item = {
            "product_id": product_id,
            "quantity": 2,
            "price": 1299.0
        }
        self.run_test("Add to Cart", "POST", f"cart/{self.session_id}/add", 200, data=cart_item)
        
        # Update cart quantity
        self.run_test("Update Cart Quantity", "PUT", f"cart/{self.session_id}/update/{product_id}?quantity=3", 200)
        
        # Get updated cart
        self.run_test("Get Updated Cart", "GET", f"cart/{self.session_id}", 200)
        
        # Remove from cart
        self.run_test("Remove from Cart", "DELETE", f"cart/{self.session_id}/remove/{product_id}", 200)
        
        # Clear cart
        self.run_test("Clear Cart", "DELETE", f"cart/{self.session_id}", 200)
        
        return cart_success

    def test_orders(self, product_id):
        """Test order endpoints"""
        print("\n=== TESTING ORDERS ===")
        
        if not product_id:
            print("❌ Skipping order tests - no product ID available")
            return False
        
        # Create order
        order_data = {
            "customer_name": "Test Customer",
            "customer_email": "test@zenkai.com",
            "customer_phone": "+91 9876543210",
            "address": "Test Address",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400001",
            "items": [
                {
                    "product_id": product_id,
                    "quantity": 1,
                    "price": 1299.0
                }
            ],
            "total_amount": 1299.0
        }
        
        order_success, order = self.run_test("Create Order", "POST", "orders/create", 200, data=order_data)
        order_id = order.get('id') if order else None
        
        if order_id:
            # Get order
            self.run_test("Get Order", "GET", f"orders/{order_id}", 200)
            
            # Create Razorpay order
            razorpay_data = {
                "amount": 1299.0,
                "order_id": order_id
            }
            self.run_test("Create Razorpay Order", "POST", "orders/create-razorpay-order", 200, data=razorpay_data)
        
        # Test non-existent order
        self.run_test("Get Non-existent Order", "GET", "orders/non-existent-id", 404)
        
        return order_success

    def test_reviews(self, product_id):
        """Test reviews endpoints"""
        print("\n=== TESTING REVIEWS ===")
        
        if not product_id:
            print("❌ Skipping review tests - no product ID available")
            return False
        
        # Get reviews for product
        self.run_test("Get Product Reviews", "GET", f"reviews/{product_id}", 200)
        
        # Create review
        review_data = {
            "product_id": product_id,
            "customer_name": "Test Reviewer",
            "rating": 5,
            "comment": "Excellent quality matcha! Very smooth and authentic taste."
        }
        
        self.run_test("Create Review", "POST", "reviews", 200, data=review_data)
        
        return True

    def test_subscriptions(self):
        """Test subscription endpoints"""
        print("\n=== TESTING SUBSCRIPTIONS ===")
        
        # Create subscription
        sub_data = {
            "customer_email": "subscriber@zenkai.com",
            "customer_name": "Test Subscriber",
            "plan": "Premium Ceremonial",
            "frequency": "monthly"
        }
        
        sub_success, subscription = self.run_test("Create Subscription", "POST", "subscriptions", 200, data=sub_data)
        
        # Get subscriptions by email
        if sub_success:
            email = sub_data["customer_email"]
            self.run_test("Get Subscriptions by Email", "GET", f"subscriptions/{email}", 200)
        
        return sub_success

    def test_blog(self):
        """Test blog endpoints"""
        print("\n=== TESTING BLOG ===")
        
        # Get all blog posts
        blog_success, posts = self.run_test("Get Blog Posts", "GET", "blog", 200)
        
        if blog_success and posts:
            # Get single blog post by slug
            first_post = posts[0]
            if 'slug' in first_post:
                self.run_test("Get Single Blog Post", "GET", f"blog/{first_post['slug']}", 200)
        
        # Test non-existent blog post
        self.run_test("Get Non-existent Blog Post", "GET", "blog/non-existent-slug", 404)
        
        return blog_success

    def test_email_capture(self):
        """Test email capture endpoint"""
        print("\n=== TESTING EMAIL CAPTURE ===")
        
        email_data = {"email": "newuser@zenkai.com"}
        return self.run_test("Email Capture", "POST", "email-capture", 200, data=email_data)

def main():
    print("🍃 Starting Zenkai Matcha API Testing...")
    print("=" * 50)
    
    # Initialize tester
    tester = ZenkaiMatchaAPITester()
    
    # Test root
    tester.test_root()
    
    # Test products and get a product ID for other tests
    products_success, product_id = tester.test_products()
    
    # Test cart functionality
    tester.test_cart(product_id)
    
    # Test orders
    tester.test_orders(product_id)
    
    # Test reviews
    tester.test_reviews(product_id)
    
    # Test subscriptions
    tester.test_subscriptions()
    
    # Test blog
    tester.test_blog()
    
    # Test email capture
    tester.test_email_capture()
    
    # Print final results
    print("\n" + "=" * 50)
    print("🏁 TESTING COMPLETE")
    print("=" * 50)
    print(f"📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("✅ Backend API is working well!")
        return 0
    elif success_rate >= 60:
        print("⚠️  Backend API has some issues but mostly functional")
        return 0
    else:
        print("❌ Backend API has significant issues")
        return 1

if __name__ == "__main__":
    sys.exit(main())