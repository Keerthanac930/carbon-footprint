# Comprehensive Testing Guide

This document provides a complete guide to testing the Carbon Footprint Calculator project.

## Table of Contents

1. [Overview](#overview)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Test Types](#test-types)
5. [Writing Tests](#writing-tests)
6. [Test Coverage](#test-coverage)
7. [CI/CD Integration](#cicd-integration)

## Overview

The project includes a comprehensive test suite covering:

- **Backend API**: Unit tests, integration tests, and end-to-end tests
- **Frontend Components**: Component tests and integration tests
- **ML Models**: Model prediction and validation tests
- **Database**: Database operation and query tests

## Test Structure

### Backend Tests (`carbon_project/backend/tests/`)

```
tests/
├── __init__.py
├── conftest.py              # Pytest fixtures and configuration
├── test_auth_service.py     # Authentication service unit tests
├── test_carbon_footprint_service.py  # Carbon footprint service tests
├── test_api_auth.py         # Authentication API integration tests
├── test_api_carbon_footprint.py  # Carbon footprint API tests
├── test_ml_model.py         # ML model tests
├── test_database.py         # Database integration tests
└── test_e2e.py              # End-to-end flow tests
```

### Frontend Tests (`carbon_project/frontend/src/`)

```
src/
├── components/
│   └── __tests__/
│       ├── SignUp.test.js
│       ├── SignIn.test.js
│       └── CarbonCalculator.test.js
└── services/
    └── __tests__/
        └── api.test.js
```

## Running Tests

### Prerequisites

```bash
# Backend dependencies
cd carbon_project/backend
pip install -r requirements.txt
pip install pytest pytest-cov pytest-asyncio

# Frontend dependencies
cd carbon_project/frontend
npm install
```

### Backend Tests

```bash
cd carbon_project/backend

# Run all tests
pytest

# Run with coverage report
pytest --cov=app --cov-report=html --cov-report=term

# Run specific test file
pytest tests/test_auth_service.py

# Run tests by marker
pytest -m unit          # Unit tests only
pytest -m integration   # Integration tests only
pytest -m api           # API tests only
pytest -m auth          # Authentication tests only

# Run in verbose mode
pytest -v

# Run with output
pytest -s
```

### Frontend Tests

```bash
cd carbon_project/frontend

# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- SignUp.test.js
```

## Test Types

### 1. Unit Tests

Test individual functions and methods in isolation.

**Example:**
```python
@pytest.mark.unit
def test_hash_password(test_db):
    auth_service = AuthService(test_db)
    password = "TestPassword123!"
    hashed = auth_service.hash_password(password)
    
    assert hashed != password
    assert auth_service.verify_password(password, hashed) is True
```

### 2. Integration Tests

Test interactions between components.

**Example:**
```python
@pytest.mark.integration
def test_login_endpoint(client, test_user):
    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "TestPassword123!"
        }
    )
    assert response.status_code == 200
```

### 3. End-to-End Tests

Test complete user flows.

**Example:**
```python
def test_complete_user_flow(client):
    # Register
    client.post("/auth/register", json={...})
    # Login
    response = client.post("/auth/login", json={...})
    # Calculate
    client.post("/carbon-footprint/calculate", json={...})
```

### 4. Component Tests (Frontend)

Test React components in isolation.

**Example:**
```javascript
test('renders sign up form', () => {
  render(<SignUp />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
});
```

## Writing Tests

### Backend Test Template

```python
import pytest
from app.services.your_service import YourService

@pytest.mark.unit
class TestYourService:
    def test_feature_name(self, test_db):
        """Test description"""
        service = YourService(test_db)
        # Test implementation
        result = service.method()
        assert result == expected_value
```

### Frontend Test Template

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  test('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Test Coverage

### Current Coverage Goals

- **Backend**: >80% code coverage
- **Frontend**: >70% code coverage
- **Critical paths**: 100% coverage

### Generating Coverage Reports

**Backend:**
```bash
pytest --cov=app --cov-report=html
# Open htmlcov/index.html in browser
```

**Frontend:**
```bash
npm test -- --coverage
# Check coverage/lcov-report/index.html
```

## Test Fixtures

Common fixtures available in `conftest.py`:

- `test_db`: Database session for tests
- `client`: FastAPI test client
- `test_user`: Pre-created test user
- `authenticated_client`: Authenticated test client
- `sample_carbon_data`: Sample calculation data

## Test Markers

Use markers to organize and filter tests:

```python
@pytest.mark.unit
@pytest.mark.auth
def test_example():
    pass
```

Available markers:
- `unit` - Unit tests
- `integration` - Integration tests
- `api` - API endpoint tests
- `ml` - Machine learning tests
- `database` - Database tests
- `auth` - Authentication tests
- `carbon` - Carbon footprint tests
- `slow` - Slow running tests

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: pip install -r requirements.txt
      - run: pytest --cov=app --cov-report=xml
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --ci
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Names**: Test names should describe what they test
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Use mocks for external services
5. **Fast Tests**: Keep tests fast (use in-memory database)
6. **Coverage**: Aim for high coverage on critical paths
7. **Maintainability**: Keep tests simple and readable

## Troubleshooting

### Common Issues

**Backend:**
- Import errors: Check Python path and dependencies
- Database errors: Ensure test database is configured
- ML model errors: Tests may skip if models are missing

**Frontend:**
- Module not found: Run `npm install`
- Mock errors: Check mock configuration
- Async errors: Use `waitFor` for async operations

### Debugging Tests

```bash
# Backend: Run with print statements
pytest -s

# Frontend: Run in watch mode
npm test -- --watch

# Run specific test
pytest tests/test_auth_service.py::TestAuthService::test_login_success
```

## Test Data Management

- Tests create their own data using fixtures
- Data is cleaned up after each test
- No persistent test data between runs
- Use factories for complex data creation

## Performance Testing

For performance tests, use the `@pytest.mark.slow` marker:

```python
@pytest.mark.slow
def test_performance():
    # Performance test implementation
    pass
```

Run excluding slow tests:
```bash
pytest -m "not slow"
```

## Next Steps

1. Add more edge case tests
2. Increase test coverage
3. Add performance tests
4. Add load testing
5. Add security tests

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/react)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)

