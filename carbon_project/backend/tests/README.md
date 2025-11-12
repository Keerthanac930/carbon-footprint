# Comprehensive Test Suite

This directory contains a comprehensive test suite for the Carbon Footprint Calculator project.

## Test Structure

### Backend Tests

- **Unit Tests**: Test individual components in isolation
  - `test_auth_service.py` - Authentication service tests
  - `test_carbon_footprint_service.py` - Carbon footprint service tests
  
- **Integration Tests**: Test component interactions
  - `test_api_auth.py` - Authentication API endpoint tests
  - `test_api_carbon_footprint.py` - Carbon footprint API endpoint tests
  - `test_database.py` - Database operation tests
  
- **ML Model Tests**: Test machine learning functionality
  - `test_ml_model.py` - ML model prediction tests
  
- **End-to-End Tests**: Test complete user flows
  - `test_e2e.py` - Complete application flow tests

### Frontend Tests

- **Component Tests**: Test React components
  - `src/components/__tests__/SignUp.test.js` - Sign up component tests
  - `src/components/__tests__/SignIn.test.js` - Sign in component tests
  - `src/components/__tests__/CarbonCalculator.test.js` - Calculator component tests
  
- **Service Tests**: Test API service layer
  - `src/services/__tests__/api.test.js` - API service tests

## Running Tests

### Backend Tests

```bash
# Run all tests
cd carbon_project/backend
pytest

# Run specific test file
pytest tests/test_auth_service.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test markers
pytest -m unit          # Run only unit tests
pytest -m integration   # Run only integration tests
pytest -m api           # Run only API tests
pytest -m ml            # Run only ML tests
pytest -m auth          # Run only auth tests
pytest -m carbon        # Run only carbon footprint tests

# Run tests in verbose mode
pytest -v

# Run tests and show print statements
pytest -s
```

### Frontend Tests

```bash
# Run all tests
cd carbon_project/frontend
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run tests in CI mode (single run)
npm test -- --ci
```

## Test Coverage

The test suite aims for comprehensive coverage:

- **Backend**: Unit tests, integration tests, API tests, database tests, ML model tests
- **Frontend**: Component tests, service tests, integration tests
- **End-to-End**: Complete user flow tests

## Test Fixtures

Common test fixtures are defined in `conftest.py`:

- `test_db`: Test database session
- `client`: Test HTTP client
- `test_user`: Pre-created test user
- `authenticated_client`: Authenticated test client
- `sample_carbon_data`: Sample carbon footprint data
- `multiple_test_users`: Multiple test users

## Test Markers

Tests are organized using pytest markers:

- `@pytest.mark.unit` - Unit tests
- `@pytest.mark.integration` - Integration tests
- `@pytest.mark.api` - API endpoint tests
- `@pytest.mark.ml` - Machine learning tests
- `@pytest.mark.database` - Database tests
- `@pytest.mark.auth` - Authentication tests
- `@pytest.mark.carbon` - Carbon footprint tests
- `@pytest.mark.slow` - Slow running tests

## Continuous Integration

Tests are designed to run in CI/CD pipelines:

1. Backend tests use SQLite in-memory database for fast execution
2. Frontend tests use Jest with React Testing Library
3. All tests are isolated and can run in parallel
4. Coverage reports are generated automatically

## Writing New Tests

### Backend Test Example

```python
import pytest
from app.services.auth_service import AuthService

@pytest.mark.unit
@pytest.mark.auth
def test_example(test_db):
    """Test description"""
    auth_service = AuthService(test_db)
    # Test implementation
    assert True
```

### Frontend Test Example

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Test Data

- Test data is created fresh for each test using fixtures
- Tests clean up after themselves
- No test data persists between test runs
- Use factories for complex test data creation

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clarity**: Test names should clearly describe what they test
3. **Coverage**: Aim for high code coverage
4. **Speed**: Keep tests fast (use mocks where appropriate)
5. **Maintainability**: Keep tests simple and readable

## Troubleshooting

### Backend Tests

- **Database errors**: Ensure test database is properly configured
- **Import errors**: Check that all dependencies are installed
- **ML model errors**: ML tests may skip if model files are missing

### Frontend Tests

- **Module not found**: Run `npm install` to install dependencies
- **Mock errors**: Ensure mocks are properly configured
- **Async errors**: Use `waitFor` for async operations

## Coverage Goals

- **Backend**: >80% code coverage
- **Frontend**: >70% code coverage
- **Critical paths**: 100% coverage

