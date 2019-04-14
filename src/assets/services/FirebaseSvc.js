import firebase from 'react-native-firebase';

class FirebaseSvc {
  constructor() {
    this.auth = firebase.auth();
    this.firestore = firebase.firestore();
    this.storage = firebase.storage();
    this.firestoreBatch = this.firestore.batch();
  }

  login = async (user, success_callback, failed_callback) => {
    await this.auth
    .signInWithEmailAndPassword(user.email, user.password)
    .then(success_callback, failed_callback);
  }

  createAccount = async (user, success_callback, failed_callback) => {
    await this.auth
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(success_callback, failed_callback);
  }

  createUser = () => {
    let user = this.auth.currentUser;
    this.firestore.collection('user').add({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
    })
    .then(function(){
      console.log("Create User DB Success");
    })
    .catch(function(error){
      console.error("Failed to Create User DB", error);
    });
  }

  uploadAvatar = async (response) => {
    const metadata = {
      contentType: response.type,
    }
    var user = this.auth.currentUser;
    this.storage.ref().child('avatar/'+user.uid)
    .putFile(response.uri, metadata)
    .then(async uploadedFile => {
      var user = this.auth.currentUser;
      user.updateProfile({
        photoURL: uploadedFile.downloadURL,
      });
      var ref = await this.firestore.collection('user').where('uid', '==', user.uid);
      ref.get().then(async (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          this.firestore.collection('user').doc(doc.id).update({photoURL: uploadedFile.downloadURL});
        });
      });
      console.log("Success Upload File", uploadedFile);
    })
    .catch(error => {
      console.log("Error Upload File", error);
    });
  }

  createProfile = async (user, success_callback) => {
    var currUser = this.auth.currentUser;
    var ref = await this.firestore.collection('user').where('uid', '==', currUser.uid);
    ref.get().then(async(querySnapshot) => {
      querySnapshot.forEach(async(doc) => {
        this.firestore.collection('user').doc(doc.id).update({displayName: user.name});
      });
    });
    currUser.updateProfile({
      displayName: user.name,
    })
    .then(success_callback, function(error) {
      console.log("Error", error);
    });
  }

  logUser = () => {
    var user = this.auth.currentUser;
    console.log("User", user);
  }

  createGroup = async (group, response) => {
    let user = this.auth.currentUser;
    let members = [];
    members.push(user.uid);
    this.firestore.collection("groups").add({
      name: group.name,
      photoURL: '',
      members: members,
      createdBy: user.uid,
    })
    .then(async (docRef) => {
      if(response) {
        const metadata = {
          contentType: response.type,
        }
        await this.storage.ref().child('group/'+docRef.id)
        .putFile(response.uri, metadata)
        .then(uploadedFile => {
          console.log("Success Upload Group Avatar", uploadedFile);
          this.firestoreBatch.update(this.firestore.collection("groups").doc(docRef.id),
            {photoURL: uploadedFile.downloadURL});
          this.firestoreBatch.commit()
          .then(async () => {
            console.log("Success update group photoURL");
          })
          .catch((error) => {
            console.log("Error Writing Data", error);
          });
        })
        .catch((error) => {
          console.log("Error Upload Group Avatar", error);
        });
      }
    })
    .catch(function(error) {
      console.log("Error Add Group", error);
    });
  }

  editGroup = (group) => {
    this.firestoreBatch.update(this.firestore.collection("groups").doc(group.id),
      {photoURL: group.photoURL, name: group.name});
    this.firestoreBatch.commit()
    .then(async () => {
      console.log("Success update group info");
    })
    .catch((error) => {
      console.log("Error Writing Data", error);
    });
  }

  deleteCategory = (item) => {
    this.firestore.collection("category").doc(item.id)
    .delete()
    .then(function() {
      console.log("Category successfully deleted!");
    })
    .catch(function(error){
      console.error("Error remove category", error);
    });

    let query = this.firestore.collection("chatrooms").where('cid', '==', item.id)
    query.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  deleteChatroom = (id) => {
    this.firestore.collection("chatrooms").doc(id)
    .delete()
    .then(function(){
      console.log("Chatroom successfully deleted!");
    })
    .catch(function(error){
      console.error("Error remove chatroom", error);
    });
  }

	deleteMember = (id, group) => {
		this.firestore.collection("groups").doc(group.id).update({
			members: group.data.members.arrayRemove(id),
		})
	}

  getCurrentUser = () => {
    var user = this.auth.currentUser;
    return user;
  }

  getGroupRef = () => {
    var user = this.auth.currentUser;
    var groupRef = this.firestore.collection("groups").where('members','array-contains',user.uid);
    return groupRef;
  }

  getGroupRefById = (id) => {
    groupRef = this.firestore.collection('groups').doc(id);
    return groupRef;
  }

  getCategoryRef = (gid) => {
    var categoryRef = this.firestore.collection("category").where('gid', '==', gid);
    return categoryRef;
  }

  getChatroomRef = (gid) => {
    var chatroomRef = this.firestore.collection("chatrooms").where('gid', '==', gid);
    return chatroomRef;
  }

  getRoleRef = (gid) => {
    var roleRef = this.firestore.collection("roles").where('gid', '==', gid);
    return roleRef;
  }

	getUserRef = () => {
    var userRef = this.firestore.collection("user");
    return userRef;
  }

  logout = (success_callback, failed_callback) => {
    this.auth.signOut()
		.then(success_callback, failed_callback);
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
