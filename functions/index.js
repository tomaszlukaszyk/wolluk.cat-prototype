const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.addRoles = functions.https.onCall((data, context) => {
  return admin.auth().setCustomUserClaims(data.uid, {
    roles: {
      isAdmin: data.roles.isAdmin,
      isEditor: data.roles.isEditor,
      isTranslator: data.roles.isTranslator,
      isDesigner: data.roles.isDesigner
    }
  })
})
