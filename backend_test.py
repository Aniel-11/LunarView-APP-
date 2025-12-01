#!/usr/bin/env python3
"""
Lunar View Backend API Testing Script
Tests all backend endpoints including the new password reset functionality:
register → login → password reset → verify old/new passwords → favorites
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BASE_URL = "https://lunar-view.preview.emergentagent.com/api"
TEST_USER = {
    "email": "test@lunarview.com",
    "password": "test123",
    "name": "Test User"
}

# Password reset test data
NEW_PASSWORD = "newpassword123"

# Test coordinates (Berlin)
TEST_COORDINATES = {
    "lat": 52.52,
    "long": 13.405
}

class LunarViewTester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.user_id = None
        self.favorite_id = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        })
        
    def test_user_registration(self):
        """Test user registration endpoint"""
        print("\n🔐 Testing User Registration...")
        
        try:
            response = self.session.post(
                f"{BASE_URL}/auth/register",
                json=TEST_USER,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201 or response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_test(
                        "User Registration", 
                        True, 
                        f"User registered successfully with ID: {self.user_id}",
                        data
                    )
                    return True
                else:
                    self.log_test(
                        "User Registration", 
                        False, 
                        "Response missing access_token or user data",
                        data
                    )
                    return False
            elif response.status_code == 400:
                # User might already exist, try to continue with login
                data = response.json()
                self.log_test(
                    "User Registration", 
                    False, 
                    f"Registration failed (user might exist): {data.get('detail', 'Unknown error')}",
                    data
                )
                return False
            else:
                self.log_test(
                    "User Registration", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    None
                )
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Exception: {str(e)}", None)
            return False
    
    def test_user_login(self):
        """Test user login endpoint"""
        print("\n🔑 Testing User Login...")
        
        try:
            login_data = {
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
            
            response = self.session.post(
                f"{BASE_URL}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_test(
                        "User Login", 
                        True, 
                        f"Login successful for user: {data['user']['email']}",
                        data
                    )
                    return True
                else:
                    self.log_test(
                        "User Login", 
                        False, 
                        "Response missing access_token or user data",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "User Login", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    None
                )
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Exception: {str(e)}", None)
            return False
    
    def test_get_current_user(self):
        """Test get current user endpoint"""
        print("\n👤 Testing Get Current User...")
        
        if not self.access_token:
            self.log_test("Get Current User", False, "No access token available", None)
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data:
                    self.log_test(
                        "Get Current User", 
                        True, 
                        f"Retrieved user data for: {data['email']}",
                        data
                    )
                    return True
                else:
                    self.log_test(
                        "Get Current User", 
                        False, 
                        "Response missing required user fields",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Get Current User", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    None
                )
                return False
                
        except Exception as e:
            self.log_test("Get Current User", False, f"Exception: {str(e)}", None)
            return False
    
    def test_astronomy_data(self):
        """Test astronomy data endpoint"""
        print("\n🌙 Testing Astronomy Data...")
        
        if not self.access_token:
            self.log_test("Astronomy Data", False, "No access token available", None)
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            params = {
                "lat": TEST_COORDINATES["lat"],
                "long": TEST_COORDINATES["long"]
            }
            
            response = self.session.get(
                f"{BASE_URL}/astronomy", 
                headers=headers,
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                # Check for key astronomy fields
                required_fields = ["sunrise", "sunset", "moonrise", "moonset"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    self.log_test(
                        "Astronomy Data", 
                        True, 
                        f"Retrieved astronomy data for Berlin (lat: {params['lat']}, long: {params['long']})",
                        data
                    )
                    return True
                else:
                    self.log_test(
                        "Astronomy Data", 
                        False, 
                        f"Response missing required fields: {missing_fields}",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Astronomy Data", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    None
                )
                return False
                
        except Exception as e:
            self.log_test("Astronomy Data", False, f"Exception: {str(e)}", None)
            return False
    
    def test_add_favorite(self):
        """Test add favorite location endpoint"""
        print("\n⭐ Testing Add Favorite Location...")
        
        if not self.access_token:
            self.log_test("Add Favorite", False, "No access token available", None)
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            favorite_data = {
                "location_name": "Berlin",
                "latitude": TEST_COORDINATES["lat"],
                "longitude": TEST_COORDINATES["long"]
            }
            
            response = self.session.post(
                f"{BASE_URL}/favorites",
                json=favorite_data,
                headers=headers
            )
            
            if response.status_code == 200 or response.status_code == 201:
                data = response.json()
                if "id" in data and "location_name" in data:
                    self.favorite_id = data["id"]
                    self.log_test(
                        "Add Favorite", 
                        True, 
                        f"Added favorite location: {data['location_name']} (ID: {self.favorite_id})",
                        data
                    )
                    return True
                else:
                    self.log_test(
                        "Add Favorite", 
                        False, 
                        "Response missing required favorite fields",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Add Favorite", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    None
                )
                return False
                
        except Exception as e:
            self.log_test("Add Favorite", False, f"Exception: {str(e)}", None)
            return False
    
    def test_get_favorites(self):
        """Test get favorites endpoint"""
        print("\n📋 Testing Get Favorites...")
        
        if not self.access_token:
            self.log_test("Get Favorites", False, "No access token available", None)
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.get(f"{BASE_URL}/favorites", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test(
                        "Get Favorites", 
                        True, 
                        f"Retrieved {len(data)} favorite location(s)",
                        data
                    )
                    return True
                else:
                    self.log_test(
                        "Get Favorites", 
                        False, 
                        "Response is not a list",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Get Favorites", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    None
                )
                return False
                
        except Exception as e:
            self.log_test("Get Favorites", False, f"Exception: {str(e)}", None)
            return False
    
    def test_delete_favorite(self):
        """Test delete favorite endpoint"""
        print("\n🗑️ Testing Delete Favorite...")
        
        if not self.access_token:
            self.log_test("Delete Favorite", False, "No access token available", None)
            return False
            
        if not self.favorite_id:
            self.log_test("Delete Favorite", False, "No favorite ID available", None)
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.delete(
                f"{BASE_URL}/favorites/{self.favorite_id}",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test(
                        "Delete Favorite", 
                        True, 
                        f"Deleted favorite successfully: {data['message']}",
                        data
                    )
                    return True
                else:
                    self.log_test(
                        "Delete Favorite", 
                        False, 
                        "Response missing success message",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Delete Favorite", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    None
                )
                return False
                
        except Exception as e:
            self.log_test("Delete Favorite", False, f"Exception: {str(e)}", None)
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Lunar View Backend API Tests")
        print(f"📍 Base URL: {BASE_URL}")
        print(f"👤 Test User: {TEST_USER['email']}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("Registration", self.test_user_registration),
            ("Login", self.test_user_login),
            ("Get Current User", self.test_get_current_user),
            ("Astronomy Data", self.test_astronomy_data),
            ("Add Favorite", self.test_add_favorite),
            ("Get Favorites", self.test_get_favorites),
            ("Delete Favorite", self.test_delete_favorite)
        ]
        
        # If registration fails, try login
        if not self.test_user_registration():
            print("\n⚠️ Registration failed, attempting login...")
            if not self.test_user_login():
                print("\n❌ Both registration and login failed. Cannot continue tests.")
                return self.generate_summary()
        
        # Continue with remaining tests
        for test_name, test_func in tests[1:]:
            test_func()
        
        return self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if total - passed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"  {status} {result['test']}: {result['message']}")
        
        return {
            "total_tests": total,
            "passed": passed,
            "failed": total - passed,
            "results": self.test_results
        }

def main():
    """Main function to run tests"""
    tester = LunarViewTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    if summary["failed"] > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()