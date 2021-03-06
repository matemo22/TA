import firebase from 'react-native-firebase';
import { AsyncStorage, Platform } from 'react-native';

class FirebaseSvc {
  constructor() {
    this.auth = firebase.auth();
    this.firestore = firebase.firestore();
    this.storage = firebase.storage();
  }

  generateCode = (length) => {
    var text = "";
    var possible = "ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  login = async (user, success_callback, failed_callback) => {
    await this.auth
    .signInWithEmailAndPassword(user.email, user.password)
    .then(success_callback, function(error){
      console.log("error login", error);
      alert(error)
    });
  }

  createAccount = async (user, success_callback) => {
    console.log("User", user);
    await this.auth
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(success_callback, function(error) {
      console.error("error create account", error);
    });
  }

  createUser = () => {
    let user = this.auth.currentUser;
    this.firestore.collection('user').doc(user.uid).set({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      groups: [],
      roles: [],
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
      console.log("Success Upload File", uploadedFile);
    })
    .catch(error => {
      console.log("Error Upload File", error);
    });
  }

	uploadFile = async (response, group, success_callback) => {
		const metadata = {
      contentType: response.type,
    }
    this.storage.ref().child('storage/'+group.id+"/"+response.fileName)
    .putFile(response.uri, metadata)
    .then(async uploadedFile => {
			console.log("Storage - Success Upload File", uploadedFile);
      var ref = await this.firestore.collection('storage');
			ref.add({
				gid: group.id,
				fileUrl: uploadedFile.downloadURL,
				createdAt: new Date(),
				fileName: response.fileName,
				fileType: response.type,
				fileSize: response.fileSize,
			})
			.then(success_callback, function(error) {
				console.error("Firestore - Error Upload File", error);
			});
    })
    .catch(error => {
      console.log("Error Upload File", error);
    });
	}

	deleteFile = (file, success_callback) => {
		this.firestore.collection("storage").doc(file.id)
    .delete()
    .then(()=>{
			var fileRef = this.storage.ref().child('storage/'+file.gid+'/'+file.fileName);
			fileRef
				.delete()
				.then(() => {
				  success_callback
				})
				.catch((error) => {
					console.log("Storage - Error Delete File", error);
				});
		})
		.catch((error) => {
			console.log("Firestore - Error Delete File", error);
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

  createGroup = async (group, response, success_callback) => {
    let user = this.auth.currentUser;
    let members = [];
    let code = this.generateCode(6);
    members.push(user.uid);
    this.firestore.collection("groups").add({
      name: group.name,
      photoURL: '',
      members: members,
      createdBy: user.uid,
      code: code,
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
      let id = docRef.id;
      let userRef = this.firestore.collection("user").doc(user.uid);
      let roleRef = this.firestore.collection("roles").add({
        canEdit: true,
        gid: id,
        name: "Admin",
      })
      .then(async (docRef)=>{
        this.firestore.runTransaction(function(transaction) {
          return transaction.get(userRef).then(function(doc) {
            var groups = [];
            var roles = [];
            if(doc.data().groups) {
              groups = doc.data().groups;
            }
            groups.push(id);
            if(doc.data().roles) {
              roles = doc.data().roles;
            }
            roles.push(docRef.id);
            transaction.update(userRef, {groups: groups, roles: roles});
          });
        });
      });
      success_callback;
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

  createCategory = (category, success_callback) => {
    this.firestore.collection("category").add({
      name: category.name,
      gid: category.gid,
      private: category.private,
      roles: category.roles,
    })
    .then(success_callback, function(error) {
      console.error("Failed to create Category", error);
      alert("Failed to Create Category");
    });
  }

  createChatroomUn = (chatroom, success_callback) => {
    this.firestore.collection("chatrooms").add({
      name: chatroom.name,
      gid: chatroom.gid,
      private: chatroom.private,
      roles: chatroom.roles,
    })
    .then(success_callback, function(error) {
      console.error("Failed to create Chatroom", error);
      alert("Failed to Create Category");
    });
  }

  createChatroom = (chatroom, success_callback) => {
    this.firestore.collection("chatrooms").add({
      name: chatroom.name,
      gid: chatroom.gid,
      private: chatroom.private,
      roles: chatroom.roles,
      cid: chatroom.cid,
    })
    .then(success_callback, function(error) {
      console.error("Failed to create Chatroom", error);
      alert("Failed to Create Category");
    });
  }

  createEvent = (event, success_callback) => {
    this.firestore.collection("event").add({
      title: event.title,
      time: event.time,
      note: event.note,
      reminder: event.reminder,
      gid: event.gid,
      time_reminder: event.time_reminder,
      cid: event.cid,
      roles: event.roles,
    })
    .then(success_callback, function(error) {
      console.error("Failed to create Event", error);
    });
  }

	createPost = (post, success_callback) => {
    this.firestore.collection("notes").add({
			text: post.text,
			createdAt: post.createdAt,
			createdBy: post.createdBy,
			gid: post.gid,
			cid: post.cid,
			roles: post.roles,
			reminder: post.reminder,
			time_reminder: post.time_reminder,
    })
    .then(success_callback, function(error) {
      console.error("Failed to create Post", error);
    });
  }

	addComment = (comment) => {
    this.firestore.collection("notes_comment").add({
			text: comment.text,
			createdAt: comment.createdAt,
			nid: comment.nid,
			uid: comment.uid,
    })
    .then(function() {
			console.log("Success Add Comment to PostId "+comment.nid);
		}, function(error) {
      console.error("Failed to create Post", error);
    });
  }

  sendMessage = (message, item) => {
    let crid = item.id;
    this.firestore.collection("chats").add({
      message,
      createdAt: message.createdAt,
      crid: crid,
    })
    .then(() => {
      console.log("Send Messages");
    })
    .catch((error) => {
      console.error("Error Send Message", error);
    });
  }

  createTodo = (todo, success_callback) => {
		var todos = todo.todo;
		todos.pop();
    this.firestore.collection("todos").add({
      title: todo.title,
      gid: todo.gid,
      cid: todo.cid,
      roles: todo.roles,
      todo: todos,
			reminder: todo.reminder,
			time_reminder: todo.time_reminder,
      completed: todo.completed,
    })
    .then(success_callback, function(error) {
      console.error("Failed to create Todo", error);
    });
  }

  editGroup = (group, success_callback) => {
    let batch = this.firestore.batch();
    let ref = this.firestore.collection("groups").doc(group.id);
    batch.update(ref, {
      name: group.name,
    });
    batch.commit()
    .then(success_callback, (error) => {
      console.log("Error Edit Group", error);
    });
  }

  editChatroom = (chatroom, success_callback) => {
    let batch = this.firestore.batch();
    let ref = this.firestore.collection("chatrooms").doc(chatroom.id);
    batch.update(ref, {
      name: chatroom.name,
      private: chatroom.private,
      roles: chatroom.roles,
    });
    batch.commit()
    .then(success_callback, (error)=>{
      console.error("Error Edit Chatroom", error);
    })
  }

  joinGroup = async (code) => {
    let ref = await this.firestore.collection("groups").where('code', '==', code).limit(1);
    ref.get()
    .then((querySnapshot) => {
      if(querySnapshot.size == 0) {
        alert("Group Not Found!");
        // AsyncStorage.setItem("message", "Group not Found");
      }
      else {
        querySnapshot.forEach((doc) => {
          console.log("DOC", doc);
          let members = doc.data().members;
          let user = this.auth.currentUser;
          let found = members.includes(user.uid);
          let id = doc.id;
          let groupRef = doc.ref;
          if(found) {
            alert("You already in Group");
            // AsyncStorage.setItem("message", "You already in Group");
          }
          else {
            members.push(user.uid);
            let userRef = this.firestore.collection("user").doc(user.uid);
            return this.firestore.runTransaction((transaction) => {
              return transaction.get(userRef).then((doc) => {
                var groups = doc.data().groups;
                groups.push(id);
                transaction.update(userRef, { groups: groups });
                transaction.update(groupRef, { members: members });
              });
            });
            // AsyncStorage.setItem("message", "Success");
          }
        });
      }
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

	updateEvent = (event, success_callback) => {
		let batch = this.firestore.batch();
    let ref = this.firestore.collection("event").doc(event.id);
    batch.update(ref, {
			title: event.title,
      time: event.time,
      note: event.note,
      reminder: event.reminder,
      gid: event.gid,
      time_reminder: event.time_reminder,
      cid: event.cid,
      roles: event.roles,
    });
    batch.commit()
    .then(success_callback, (error)=>{
      console.error("Error update Event", error);
    });
  }

	updateTodo = (todo, success_callback) => {
		let batch = this.firestore.batch();
    let ref = this.firestore.collection("todos").doc(todo.id);
		var todos = todo.todo;
		todos.pop();
		batch.update(ref, {
			title: todo.title,
      gid: todo.gid,
      cid: todo.cid,
      roles: todo.roles,
      todo: todos,
			reminder: todo.reminder,
			time_reminder: todo.time_reminder,
      completed: todo.completed,
    });
    batch.commit()
    .then(success_callback, (error)=>{
      console.error("Error update Todo", error);
    });
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

  updateCode = (gid, success_callback) => {
    let batch = this.firestore.batch();
    let ref = this.firestore.collection("groups").doc(gid);
    let code = this.generateCode(6);
    batch.update(ref, {
      code: code,
    });
    batch.commit()
    .then(success_callback, function(error) {
      console.error("Error Update Group Code", error);
    })
  }

  deleteCategory = (item, success_callback) => {
    this.firestore.collection("category").doc(item.id)
    .delete()
    .then(success_callback, function(error){
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

  // sendMessage = (messages, crid) => {
  //   this.firestore.collection("chats").add({
  //     messages,
  //     crid: crid,
  //   });
  // }

  getCurrentUser = () => {
    var user = this.auth.currentUser;
    return user;
  }

  getGroupRef = () => {
    var user = this.auth.currentUser;
    var groupRef = this.firestore
      .collection("groups")
      .where('members','array-contains',user.uid);
      // .orderBy('name');
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

  getChatRef = (crid) => {
    var chatRef = this.firestore.collection("chats").where('crid', '==', crid);
    chatRef = chatRef.orderBy("createdAt", "desc");
    return chatRef;
  }

  getEventRef = (gid) => {
    var eventRef = this.firestore.collection("event").where('gid','==',gid);
		eventRef = eventRef.orderBy("time", "asc");
    return eventRef;
  }

  getAllEventRef = () => {
    var eventRef = this.firestore.collection("event");
    return eventRef;
  }

  getTodosRef = (gid) => {
    var todosRef = this.firestore.collection("todos").where('gid','==',gid);
    return todosRef;
  }

  getAllTodosRef = () => {
    var todosRef = this.firestore.collection("todos");
    return todosRef;
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

  getNotesRef = (gid) => {
    var notesRef = this.firestore.collection("notes").where("gid", "==", gid);
    return notesRef;
  }

	getCommentRef = (nid) => {
    var commentRef = this.firestore.collection("notes_comment").where("nid", "==", nid);
		commentRef = commentRef.orderBy("createdAt", "asc");
    return commentRef;
  }

	getStorageRef = (gid) => {
    var storageRef = this.firestore.collection("storage").where("gid", "==", gid);
    return storageRef;
  }

  logout = (success_callback, failed_callback) => {
    this.auth.signOut()
		.then(success_callback, failed_callback);
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
