// import firebase from '@/plugins/firebase'
var provider = null;

$(function () {
    // Set Background Image
    firebase.storage().ref('03.jpg').getDownloadURL().then((url) => {
        $(".bg-img").attr("src", url);
    });
    firebase.storage().ref('ofuro.png').getDownloadURL().then((url) => {
        $(".front-img").attr("src", url);
    });


    // Header Contents
    provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            $("#auth").empty();
            const imgURL = user.photoURL;
            const signOutMessage = `<img src="`+imgURL+`" width="35px" height="auto">
            <button class="btn btn-outline-danger" type="submit"  onClick="signOut()">Sign out<\/button>
            `;
            $('#auth').append(signOutMessage);
            console.log(user.displayName+'（'+user.uid+'）でログインしています');
            console.log(imgURL);

        } else {
            $("#auth").empty();
            const signInMessage = `
              <button class="btn btn-outline-primary" type="submit"  onClick="signIn()">Sign in<\/button>
              `;
            $('#auth').append(signInMessage);
        }
    });


    const stamp = 50;

    for (let i = 1; i <= 50; i++) {
        if (i <= stamp) {
            var num = Math.floor(Math.random() * 31) + 1;
            firebase.storage().ref("stamp" + num + ".png").getDownloadURL().then((url) => {
                $(".stamp" + i).append('<img src="' + url + '" class="back-stamp-img">');
            });
        } else {
            $(".stamp" + i).append(i);
        }
    }

    if (stamp < 2) {
        $(".card-subtitle").append(stamp + " Stamp!")
    } else if (stamp < 50) {
        $(".card-subtitle").append(stamp + " Stamps!")
    } else if (stamp == 50) {
        $(".card-subtitle").append("50 Stamps!  Congratulation!")
    }

    // firebase.database().ref('/user/1').on('value', snapshot => { });
    // const loadEl = document.querySelector('#load');

    // firebase.storage().ref('stamp1.png').getDownloadURL().then((url) => {
    //   document.getElementById("img").src = url;
    // });
    // // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // // The Firebase SDK is initialized and available here!
    // //
    // // firebase.auth().onAuthStateChanged(user => { });
    // // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // // firebase.messaging().requestPermission().then(() => { });
    // // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // // firebase.analytics(); // call to activate
    // // firebase.analytics().logEvent('tutorial_completed');
    // // firebase.performance(); // call to activate
    // //
    // // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    // try {
    //   let app = firebase.app();
    //   let features = [
    //     'auth', 
    //     'database', 
    //     'firestore',
    //     'functions',
    //     'messaging', 
    //     'storage', 
    //     'analytics', 
    //     'remoteConfig',
    //     'performance',
    //   ].filter(feature => typeof app[feature] === 'function');
    //   loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
    // } catch (e) {
    //   console.error(e);
    //   loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
    // }

    $('.card').on("click", function () {
        $(".card-front").toggleClass("reverse");
        $(".card-back").toggleClass("reverse");
    });

    $('.cell').on("click", function (e) {
        e.stopPropagation();
        alert("click");
    })
});

function signIn() {
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            console.log('ログインしました。');

        }).catch(error => {
            const signinError = `
          サインインエラー
          エラーメッセージ： ${error.message}
          エラーコード: ${error.code}
          `
            console.log(signinError);
        });
}

function signOut() {
    firebase.auth().onAuthStateChanged(user => {
        firebase.auth().signOut()
            .then(() => {
                console.log('ログアウトしました');
                location.reload();
            })
            .catch((error) => {
                console.log(`ログアウト時にエラーが発生しました (${error})`);
            });
    });
}