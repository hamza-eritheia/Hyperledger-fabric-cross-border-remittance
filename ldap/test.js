const ldap = require('./index')

// ldap.addUser('2', 'Luke', 'Skywalker', 'useforce')
// .then(() => console.log('Successful Add'), () => console.log('Error'))

ldap.authenticate('dedsec', 'useforce')
.then(() => console.log('Successful Auth'), () => console.log('Error'))