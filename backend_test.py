#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, List

class AyurvedLifeAPITester:
    def __init__(self, base_url="https://ayurveda-care-9.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_result(self, test_name: str, success: bool, details: str = "", response_data: Dict = None):
        """Log test result"""
        result = {
            "test_name": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.results.append(result)
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED")
            if details:
                print(f"   Details: {details}")
        else:
            print(f"❌ {test_name}: FAILED")
            print(f"   Details: {details}")

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("API Root", True, f"Status: {response.status_code}, Message: {data.get('message')}", data)
                else:
                    self.log_result("API Root", False, f"Status: {response.status_code}, Missing message field")
            else:
                self.log_result("API Root", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("API Root", False, f"Error: {str(e)}")

    def test_products_endpoint(self):
        """Test products endpoint - should return all 10 products"""
        try:
            response = requests.get(f"{self.api_url}/products", timeout=10)
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list) and len(products) == 10:
                    # Verify all products have required fields and ₹1,999 price
                    all_valid = True
                    missing_fields = []
                    wrong_prices = []
                    
                    required_fields = ["id", "name", "nameHindi", "benefits", "price", "image", "description"]
                    
                    for product in products:
                        for field in required_fields:
                            if field not in product:
                                all_valid = False
                                missing_fields.append(f"Product {product.get('id', 'unknown')} missing {field}")
                        
                        if product.get("price") != 1999:
                            all_valid = False
                            wrong_prices.append(f"Product {product.get('name', 'unknown')} has price {product.get('price')}")
                    
                    if all_valid:
                        product_names = [p.get('name') for p in products]
                        self.log_result("Products Endpoint", True, 
                                      f"All 10 products returned with correct fields and ₹1,999 price. Products: {', '.join(product_names)}", 
                                      {"total_products": len(products), "product_names": product_names})
                    else:
                        error_details = []
                        if missing_fields:
                            error_details.extend(missing_fields)
                        if wrong_prices:
                            error_details.extend(wrong_prices)
                        self.log_result("Products Endpoint", False, f"Validation issues: {'; '.join(error_details)}")
                else:
                    self.log_result("Products Endpoint", False, f"Expected 10 products, got {len(products) if isinstance(products, list) else 'invalid data'}")
            else:
                self.log_result("Products Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Products Endpoint", False, f"Error: {str(e)}")

    def test_consultation_submission(self):
        """Test consultation form submission"""
        test_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "phone": "9876543210"
        }
        
        try:
            response = requests.post(f"{self.api_url}/consultation", json=test_data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if all(key in result for key in ["id", "name", "phone", "created_at", "status"]):
                    if result["name"] == test_data["name"] and result["phone"] == test_data["phone"]:
                        self.log_result("Consultation Submission", True, 
                                      f"Form submitted successfully. ID: {result['id']}, Status: {result['status']}", result)
                    else:
                        self.log_result("Consultation Submission", False, "Submitted data doesn't match returned data")
                else:
                    self.log_result("Consultation Submission", False, "Response missing required fields")
            else:
                try:
                    error_detail = response.json()
                    self.log_result("Consultation Submission", False, f"Status: {response.status_code}, Error: {error_detail}")
                except:
                    self.log_result("Consultation Submission", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Consultation Submission", False, f"Error: {str(e)}")

    def test_consultation_validation(self):
        """Test consultation form validation"""
        # Test empty data
        try:
            response = requests.post(f"{self.api_url}/consultation", json={}, timeout=10)
            if response.status_code in [400, 422]:  # Bad request or validation error
                self.log_result("Consultation Validation (Empty)", True, f"Correctly rejected empty data with status {response.status_code}")
            else:
                self.log_result("Consultation Validation (Empty)", False, f"Should reject empty data, got status {response.status_code}")
        except Exception as e:
            self.log_result("Consultation Validation (Empty)", False, f"Error: {str(e)}")

        # Test invalid phone
        invalid_data = {
            "name": "Test User", 
            "phone": "123"  # Too short
        }
        try:
            response = requests.post(f"{self.api_url}/consultation", json=invalid_data, timeout=10)
            if response.status_code in [400, 422]:
                self.log_result("Consultation Validation (Invalid Phone)", True, f"Correctly rejected invalid phone with status {response.status_code}")
            else:
                self.log_result("Consultation Validation (Invalid Phone)", False, f"Should reject invalid phone, got status {response.status_code}")
        except Exception as e:
            self.log_result("Consultation Validation (Invalid Phone)", False, f"Error: {str(e)}")

    def test_get_consultations(self):
        """Test getting consultation list"""
        try:
            response = requests.get(f"{self.api_url}/consultations", timeout=10)
            if response.status_code == 200:
                consultations = response.json()
                if isinstance(consultations, list):
                    self.log_result("Get Consultations", True, 
                                  f"Successfully retrieved {len(consultations)} consultation records", 
                                  {"total_consultations": len(consultations)})
                else:
                    self.log_result("Get Consultations", False, "Response is not a list")
            else:
                self.log_result("Get Consultations", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Get Consultations", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Ayurved Life API Tests")
        print(f"📍 Testing API: {self.api_url}")
        print("=" * 50)
        
        # Test API endpoints
        self.test_api_root()
        self.test_products_endpoint()
        self.test_consultation_submission()
        self.test_consultation_validation()
        self.test_get_consultations()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️ Some tests failed!")
            return 1

    def get_test_results(self):
        """Return detailed test results"""
        return {
            "summary": {
                "tests_run": self.tests_run,
                "tests_passed": self.tests_passed,
                "success_rate": f"{(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%"
            },
            "results": self.results
        }

def main():
    tester = AyurvedLifeAPITester()
    exit_code = tester.run_all_tests()
    
    # Save detailed results
    results = tester.get_test_results()
    with open("/app/backend_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Detailed results saved to: /app/backend_test_results.json")
    return exit_code

if __name__ == "__main__":
    sys.exit(main())