# Carbon Footprint Database Architecture

## 🏗️ System Overview

This document outlines the comprehensive database architecture for the Carbon Footprint application, designed to handle user management, authentication, carbon footprint calculations, and historical data tracking.

## 📋 Architecture Components

### 1. Database Layer
- **MySQL 8.0+** as the primary database
- **SQLAlchemy ORM** for database operations
- **Connection pooling** for performance optimization
- **Migration scripts** for database management

### 2. Data Models
- **User Management**: Users, profiles, sessions
- **Carbon Tracking**: Footprints, recommendations, goals
- **System Management**: Audit logs, configuration
- **Analytics**: Views, stored procedures, statistics

### 3. Service Layer
- **Repository Pattern** for data access
- **Service Classes** for business logic
- **Authentication Service** for user management
- **Carbon Footprint Service** for calculations

### 4. API Layer
- **FastAPI** for REST API endpoints
- **JWT Authentication** for security
- **Pydantic Schemas** for data validation
- **CORS Support** for frontend integration

## 🗄️ Database Schema

### Core Tables

#### Users Table
```sql
users (
    id, uuid, email, username, first_name, last_name,
    password_hash, is_active, is_verified,
    email_verification_token, password_reset_token,
    password_reset_expires, last_login,
    created_at, updated_at
)
```

#### Carbon Footprints Table
```sql
carbon_footprints (
    id, user_id, calculation_uuid, input_data (JSON),
    total_emissions, confidence_score, model_name, model_version,
    electricity_emissions, transportation_emissions, heating_emissions,
    waste_emissions, lifestyle_emissions, other_emissions,
    calculation_date, ip_address, user_agent, is_anonymous,
    created_at, updated_at
)
```

#### Recommendations Table
```sql
recommendations (
    id, carbon_footprint_id, category, title, description,
    action_required, potential_savings, priority,
    estimated_impact, is_implemented, implemented_at, created_at
)
```

#### User Goals Table
```sql
user_goals (
    id, user_id, goal_type, target_emissions, reduction_percentage,
    target_date, description, is_achieved, achieved_at,
    created_at, updated_at
)
```

### Supporting Tables

#### User Profiles
- Extended user information
- Personal preferences
- Contact details

#### User Sessions
- JWT session management
- Device tracking
- Security monitoring

#### Audit Logs
- Complete change tracking
- Security auditing
- Compliance support

#### System Config
- Application settings
- Feature flags
- Maintenance mode

## 🔧 Repository Pattern

### UserRepository
- User CRUD operations
- Authentication methods
- Profile management
- Session handling

### CarbonFootprintRepository
- Footprint calculations
- Historical data
- Statistics and analytics
- Trend analysis

### RecommendationRepository
- Recommendation generation
- Implementation tracking
- Priority management
- Performance metrics

### UserGoalRepository
- Goal setting
- Progress tracking
- Achievement monitoring
- Goal analytics

## 🛡️ Security Features

### Authentication
- **JWT Tokens**: Access and refresh token system
- **Password Hashing**: bcrypt with salt
- **Session Management**: Secure session handling
- **Email Verification**: Account verification system
- **Password Reset**: Secure password recovery

### Data Protection
- **Input Validation**: Pydantic schema validation
- **SQL Injection Prevention**: SQLAlchemy ORM
- **CORS Configuration**: Cross-origin request control
- **Rate Limiting**: API rate limiting
- **Audit Logging**: Complete activity tracking

### Privacy Controls
- **Anonymous Calculations**: No-auth footprint calculations
- **Data Anonymization**: User data protection
- **Export Capabilities**: User data export
- **Account Deletion**: Complete data cleanup

## 📊 Analytics and Reporting

### Built-in Views
- **user_carbon_summary**: User statistics aggregation
- **recent_calculations**: Recent activity tracking

### Stored Procedures
- **GetUserCarbonHistory**: Historical data retrieval
- **GetUserStats**: Statistical analysis
- **CleanupExpiredSessions**: Maintenance automation

### Key Metrics
- User engagement tracking
- Calculation frequency analysis
- Recommendation implementation rates
- Goal achievement statistics
- System performance metrics

## 🚀 Performance Optimizations

### Database Level
- **Indexes**: Optimized query performance
- **Connection Pooling**: Efficient connection management
- **Query Optimization**: Efficient data retrieval
- **Partitioning**: Large table management

### Application Level
- **Caching**: Frequently accessed data
- **Lazy Loading**: On-demand data loading
- **Batch Operations**: Efficient bulk operations
- **Async Processing**: Non-blocking operations

## 🔄 Data Flow

### 1. User Registration
```
Frontend → API → AuthService → UserRepository → Database
```

### 2. Carbon Footprint Calculation
```
Frontend → API → CarbonService → ML Model → Database
```

### 3. Data Retrieval
```
Frontend → API → Service → Repository → Database → Response
```

### 4. Analytics Processing
```
Database → Stored Procedures → Views → API → Frontend
```

## 🛠️ Maintenance and Operations

### Regular Tasks
- **Session Cleanup**: Remove expired sessions
- **Audit Log Rotation**: Archive old logs
- **Database Optimization**: Performance tuning
- **Backup Management**: Data protection

### Monitoring
- **Performance Metrics**: Query performance
- **User Analytics**: Engagement tracking
- **Error Monitoring**: System health
- **Security Auditing**: Threat detection

## 📈 Scalability Considerations

### Horizontal Scaling
- **Database Sharding**: Data distribution
- **Load Balancing**: Traffic distribution
- **Microservices**: Service separation
- **Caching Layer**: Redis integration

### Vertical Scaling
- **Resource Optimization**: CPU/Memory tuning
- **Query Optimization**: Performance improvement
- **Index Optimization**: Faster queries
- **Connection Pooling**: Efficient resource usage

## 🔍 Testing Strategy

### Unit Testing
- Repository layer testing
- Service layer testing
- Model validation testing
- Authentication testing

### Integration Testing
- API endpoint testing
- Database integration testing
- Authentication flow testing
- End-to-end testing

### Performance Testing
- Load testing
- Stress testing
- Database performance testing
- API response time testing

## 📚 Documentation

### API Documentation
- **Swagger/OpenAPI**: Interactive API docs
- **Endpoint Documentation**: Detailed descriptions
- **Schema Documentation**: Data structure docs
- **Authentication Guide**: Security documentation

### Database Documentation
- **Schema Documentation**: Table descriptions
- **Relationship Diagrams**: ER diagrams
- **Migration Guides**: Database updates
- **Performance Tuning**: Optimization guides

## 🚨 Error Handling

### Database Errors
- Connection failures
- Query timeouts
- Constraint violations
- Transaction rollbacks

### Application Errors
- Validation errors
- Authentication failures
- Business logic errors
- External service failures

### Recovery Strategies
- Automatic retries
- Fallback mechanisms
- Error logging
- User notification

## 🔮 Future Enhancements

### Planned Features
- **Real-time Analytics**: Live data processing
- **Machine Learning**: Advanced recommendations
- **Mobile API**: Mobile app support
- **Third-party Integration**: External services

### Technical Improvements
- **GraphQL API**: Flexible data querying
- **Event Sourcing**: Complete audit trail
- **Microservices**: Service decomposition
- **Cloud Deployment**: Scalable infrastructure

---

This architecture provides a robust, scalable, and secure foundation for the Carbon Footprint application, supporting both current requirements and future growth.
