import requests
import json
import logging
from typing import Dict, Any, Optional, List, Callable
import time
from dataclasses import dataclass
from enum import Enum, auto
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TestStatus(Enum):
    SUCCESS = auto()
    FAILED = auto()
    SKIPPED = auto()

@dataclass
class TestResult:
    status: TestStatus
    message: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class APITester:
    def __init__(self, base_url: str = 'https://orange-journey-x5xj9495w7qc676v-5002.app.github.dev'):
        """Initialize API tester with base URL."""
        # Store the base URL without /api prefix
        self.base_url = base_url.rstrip('/')
        self.api_prefix = '/api'  # Store prefix separately
        self.max_retries = 5
        self.retry_delay = 2
        self.summary = TestSummary()
        self.tests: List[Callable[[], TestResult]] = [
            self.test_health,
            self.test_analyze
        ]

    def get_url(self, endpoint: str) -> str:
        """Construct URL with proper prefix."""
        # Remove leading slash from endpoint if present
        endpoint = endpoint.lstrip('/')
        return f"{self.base_url}{self.api_prefix}/{endpoint}"    

    def wait_for_server(self) -> bool:
        """Wait for server to become available."""
        logger.info(f"Waiting for server at {self.base_url}")
        start_time = time.time()
        
        for i in range(self.max_retries):
            try:
                response = requests.get(f'{self.base_url}/health', timeout=5)
                if response.status_code == 200:
                    elapsed = time.time() - start_time
                    logger.info(f"Server ready after {elapsed:.2f}s")
                    return True
            except requests.RequestException as e:
                dots = "." * (i + 1)
                logger.warning(f"Server not ready{dots} ({i+1}/{self.max_retries})")
                if i < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                
        logger.error(f"Server failed to respond after {self.max_retries} attempts")
        return False

    def test_health(self) -> TestResult:
        """Test the health check endpoint."""
        try:
            response = requests.get(self.get_url('health'), timeout=5)
            if response.status_code == 200:
                return TestResult(
                    TestStatus.SUCCESS,
                    "Health check passed",
                    response.json()
                )
            return TestResult(
                TestStatus.FAILED,
                f"Health check failed: HTTP {response.status_code}",
                error=response.text
            )
        except requests.Timeout:
            return TestResult(
                TestStatus.FAILED,
                "Health check timed out",
                error="Request timed out after 5 seconds"
            )
        except Exception as e:
            return TestResult(
                TestStatus.FAILED,
                "Health check error",
                error=str(e)
            )

    def test_analyze(self) -> TestResult:
        """Test the business analysis endpoint."""
        data = {
            'business_idea': 'A subscription-based music streaming service'
        }
        headers = {'Content-Type': 'application/json'}
        
        try:
            response = requests.post(
                self.get_url('analyze'),
                json=data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return TestResult(
                    TestStatus.SUCCESS,
                    "Analysis successful",
                    response.json()
                )
            return TestResult(
                TestStatus.FAILED,
                f"Analysis failed: HTTP {response.status_code}",
                error=response.text
            )
        except requests.Timeout:
            return TestResult(
                TestStatus.FAILED,
                "Analysis timed out",
                error="Request timed out after 10 seconds"
            )
        except Exception as e:
            return TestResult(
                TestStatus.FAILED,
                "Analysis error",
                error=str(e)
            )

    # ... rest of the APITester class remains the same ...

def run_tests():
    """Run all API tests with improved reporting."""
    tester = APITester()
    start_time = time.time()

    try:
        if not tester.wait_for_server():
            logger.error("Could not connect to server")
            return 1

        # Run all registered tests
        for test in tester.tests:
            result = tester.run_test(test)
            if result.status == TestStatus.FAILED:
                logger.error(f"Test failed: {result.message}")
                if result.error:
                    logger.error(f"Error details: {result.error}")
                return 1

    except KeyboardInterrupt:
        logger.info("Tests interrupted by user")
        return 130
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return 1
    finally:
        tester.summary.duration = time.time() - start_time
        tester.print_summary()

    return 0 if tester.summary.failed == 0 else 1

if __name__ == '__main__':
    exit(run_tests())