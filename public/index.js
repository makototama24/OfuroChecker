// import firebase from '@/plugins/firebase'

$(function () {
    firebase.storage().ref('03.jpg').getDownloadURL().then((url) => {
        $(".bg-img").attr("src", url);
    });
    firebase.storage().ref('ofuro.png').getDownloadURL().then((url) => {
        $(".front-img").attr("src", url);
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

    firebase.database().ref('/user/1').on('value', snapshot => { });
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