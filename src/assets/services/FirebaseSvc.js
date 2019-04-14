import firebase from 'react-native-firebase';

class FirebaseSvc {
  constructor() {
    this.auth = firebase.auth();
    this.firestore = firebase.firestore();
    this.storage = firebase.storage();
  }

  // initData = () =>{
  //   this.firestore.collection("user").doc("3IXi6oDQ28VKYJsdmMQXC2uIokW2")
  //   .set({
  //     displayName: "Mmau22",
  //     email: "mmau22@gmail.com",
  //     photoURL: "https://firebasestorage.googleapis.com/v0/b/tugasakhir-74ab0.appspot.com/o/avatar%2F3IXi6oDQ28VKYJsdmMQXC2uIokW2?alt=media&token=620ffdf4-3dd6-4b38-863e-7cd3e474d809",
  //     uid: "3IXi6oDQ28VKYJsdmMQXC2uIokW2",
  //   });
  //
  //   this.firestore.collection("user").doc("Hk6Ziy2NLqc5BuYWIRapx8d7eAO2")
  //   .set({
  //     displayName: "Test",
  //     email: "test@gmail.com",
  //     photoURL: null,
  //     uid: "Hk6Ziy2NLqc5BuYWIRapx8d7eAO2",
  //   });
  //
  //   this.firestore.collection("user").doc("RHzc1C13HwcpIjFaJgzgTYToP8u1")
  //   .set({
  //     displayName: "Matemo",
  //     email: "matemo2204@gmail.com",
  //     photoURL: "https://firebasestorage.googleapis.com/v0/b/tugasakhir-74ab0.appspot.com/o/avatar%2FRHzc1C13HwcpIjFaJgzgTYToP8u1?alt=media&token=80b6e7b2-de55-4d77-9cc5-2c0dd0471f3b",
  //     uid: "RHzc1C13HwcpIjFaJgzgTYToP8u1",
  //     roles: ["aAsfDOywWWgEPbocj6yP"],
  //   });
  // }

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
    this.firestore.collection('user').doc(user.uid).set({
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
      var ref = await this.firestore.collection('user').doc(user.uid);
      ref.update({photoURL: uploadedFile.downloadURL});
      // ref.get().then(async (querySnapshot) => {
      //   querySnapshot.forEach(async (doc) => {
      //     this.firestore.collection('user').doc(doc.id).update({photoURL: uploadedFile.downloadURL});
      //   });
      // });
      console.log("Success Upload File", uploadedFile);
    })
    .catch(error => {
      console.log("Error Upload File", error);
    });
  }

  createProfile = async (user, success_callback) => {
    var currUser = this.auth.currentUser;
    var ref = await this.firestore.collection('user').doc(currUser.uid);
    ref.update({displayName: user.name});
    currUser.updateProfile({
      displayName: user.name,
    })
    .then(success_callback, function(error) {
      console.log("Error", error);
    });
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
          let batch = this.firestore.batch();
          let ref = this.firestore.collection("groups").doc(docRef.id);
          batch.update(ref, {
            photoURL: uploadedFile.downloadURL
          });
          batch.commit()
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

      let refUser = this.firestore.collection("user").doc(user.uid);
      this.firestore.runTransaction(function(transaction) {
        return transaction.get(refUser).then(function(doc) {
          var groups = doc.data().groups;
          groups.push(docRef.id);
          transaction.update(refUser, {groups: groups});
        });
      });
    })
    .catch(function(error) {
      console.log("Error Add Group", error);
    });
  }

  createRole = (role, success_callback) => {
    this.firestore.collection("roles").add({
      name: role.name,
      canEdit: role.status,
      gid: role.gid,
    })
    .then(success_callback, function(error) {
      console.error("Failed to create Role", error);
    });
  }

  editGroup = (group) => {
    let batch = this.firestore.batch();
    let ref = this.firestore.collection("groups").doc(group.id);
    batch.update(ref, {
      photoURL: group.photoURL,
      name: group.name
    });
    batch.commit()
    .then(async () => {
      console.log("Success update group info");
    })
    .catch((error) => {
      console.log("Error Writing Data", error);
    });
  }

  updateRole = (item, success_callback) => {
    let batch = this.firestore.batch();
    let ref = this.firestore.collection("roles").doc(item.gid);
    batch.update(ref, {
      name: item.name,
      canEdit: item.status,
    });
    batch.commit()
    .then(success_callback, function(error) {
      console.error("Error Update Role", error);
    })
  }

  updateUserRole = (item, success_callback) => {
    let batch = this.firestore.batch();
    let ref = this.firestore.collection("user").doc(item.uid);
    batch.update(ref, {
      roles: item.selectedRoles,
    });
    batch.commit()
    .then(success_callback, function(error) {
      console.error("Error Update User Role", error);
    })
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

	deleteMember = async (id, group, success_callback) => {
    let data = group._data.members;
    data.splice(data.indexOf(id), 1);
    let batch = this.firestore.batch();
    var ref = await this.firestore.collection('groups').doc(group.id);
    batch.update(ref, {members: data});
    batch.commit().then(success_callback, function(error){
      console.error("Failed to delete member", error);
    });
	}

  deleteRole = (id, success_callback) => {
    this.firestore.collection("roles").doc(id)
    .delete()
    .then(success_callback, function(error) {
      console.error("Failed to delete Role", error);
    });
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

	getUserRef = (uid) => {
    var userRef = this.firestore.collection("user").doc(uid);
    return userRef;
  }

  getAllUserRefByGId = (gid) => {
    var userRef = this.firestore.collection("user").where("groups", "array-contains", gid);
    return userRef;
  }

  logout = (success_callback, failed_callback) => {
    this.auth.signOut()
		.then(success_callback, failed_callback);
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
