# Driver Dashboard Redesign Instructions

## Color Scheme
- Primary: #023e8a (Deep Blue)
- Secondary: white
- Accent: #dc3545 (Red for logout)
- Success: #43e97b (Keep green for attendance)

## Changes Needed in App.js

### 1. Update Driver Dashboard Screen (line ~700)
Replace the entire DriverDashboard section with:

```javascript
// Driver Dashboard
if (currentScreen === 'DriverDashboard') {
  return (
    <View style={styles.dashboard}>
      <StatusBar barStyle="light-content" />
      <View style={styles.dashHeaderModern}>
        <View style={styles.dashHeaderTop}>
          <View>
            <Text style={styles.greetingModern}>Welcome Back</Text>
            <Text style={styles.userNameModern}>{user?.name}</Text>
          </View>
          <TouchableOpacity style={styles.profileIconBtn} onPress={viewDriverProfile}>
            <View style={styles.profileIconCircle}>
              <Text style={styles.profileIconText}>{user?.name?.charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.dashContentModern}>
        <View style={styles.routeCardPremium}>
          <View style={styles.routeCardPremiumHeader}>
            <View style={styles.routeIconCircle}>
              <Text style={styles.routeIconModern}>🚌</Text>
            </View>
            <View style={styles.routeCardPremiumContent}>
              <Text style={styles.routeCardPremiumLabel}>ASSIGNED ROUTE</Text>
              <Text style={styles.routeCardPremiumTitle}>{user?.assignedRoute}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.gridCard} onPress={loadStudents}>
            <View style={styles.gridCardIcon}>
              <Text style={styles.gridCardIconText}>👤</Text>
            </View>
            <Text style={styles.gridCardTitle}>Students</Text>
            <Text style={styles.gridCardSub}>Manage attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={loadAttendanceReport}>
            <View style={styles.gridCardIcon}>
              <Text style={styles.gridCardIconText}>📋</Text>
            </View>
            <Text style={styles.gridCardTitle}>Attendance</Text>
            <Text style={styles.gridCardSub}>View reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={openCalendar}>
            <View style={styles.gridCardIcon}>
              <Text style={styles.gridCardIconText}>📅</Text>
            </View>
            <Text style={styles.gridCardTitle}>Calendar</Text>
            <Text style={styles.gridCardSub}>History & dates</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={openMap}>
            <View style={styles.gridCardIcon}>
              <Text style={styles.gridCardIconText}>🗺️</Text>
            </View>
            <Text style={styles.gridCardTitle}>Route Map</Text>
            <Text style={styles.gridCardSub}>View navigation</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtnModern} onPress={handleLogout}>
          <Text style={styles.logoutTextModern}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
```

### 2. Add New Styles (add to end of StyleSheet before closing })

```javascript
dashHeaderModern: {
  backgroundColor: '#023e8a',
  paddingTop: 60,
  paddingBottom: 30,
  paddingHorizontal: 20,
},
dashHeaderTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
greetingModern: {
  fontSize: 14,
  color: 'rgba(255,255,255,0.8)',
  marginBottom: 5,
},
userNameModern: {
  fontSize: 28,
  fontWeight: 'bold',
  color: 'white',
},
profileIconBtn: {
  padding: 5,
},
profileIconCircle: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
},
profileIconText: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#023e8a',
},
dashContentModern: {
  flex: 1,
  backgroundColor: '#f5f7fa',
  paddingTop: 20,
  paddingHorizontal: 20,
},
routeCardPremium: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 20,
  marginBottom: 25,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 5,
  borderLeftWidth: 5,
  borderLeftColor: '#023e8a',
},
routeCardPremiumHeader: {
  flexDirection: 'row',
  alignItems: 'center',
},
routeIconCircle: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#023e8a',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},
routeIconModern: {
  fontSize: 28,
},
routeCardPremiumContent: {
  flex: 1,
},
routeCardPremiumLabel: {
  fontSize: 11,
  fontWeight: '700',
  color: '#023e8a',
  letterSpacing: 1.2,
  marginBottom: 5,
},
routeCardPremiumTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  lineHeight: 22,
},
quickActionsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 20,
},
gridCard: {
  width: '48%',
  backgroundColor: 'white',
  borderRadius: 15,
  padding: 20,
  marginBottom: 15,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
},
gridCardIcon: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#023e8a',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
},
gridCardIconText: {
  fontSize: 24,
},
gridCardTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
  textAlign: 'center',
},
gridCardSub: {
  fontSize: 12,
  color: '#999',
  textAlign: 'center',
},
logoutBtnModern: {
  backgroundColor: '#dc3545',
  padding: 16,
  borderRadius: 15,
  alignItems: 'center',
  marginBottom: 30,
},
logoutTextModern: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'white',
},
```

### 3. Update Login/Register Colors
Change these existing styles:
- `container.backgroundColor`: '#023e8a'
- `button.backgroundColor`: '#023e8a'
- `link.color`: '#023e8a'
- `roleBtnActive.backgroundColor`: '#e8f4f8'
- `roleBtnActive.borderColor`: '#023e8a'
- `roleTextActive.color`: '#023e8a'
- `routeCardActive.backgroundColor`: '#e8f4f8'
- `routeCardActive.borderColor`: '#023e8a'
- `radioCircleActive.borderColor`: '#023e8a'
- `radioDot.backgroundColor`: '#023e8a'
- `routeTextActive.color`: '#023e8a'
- `dashHeader.backgroundColor`: '#023e8a'

This will create a modern, professional dashboard with grid layout and the new color scheme!
