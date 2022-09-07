// import firebase from '@/plugins/firebase'
var provider = null;
const MAX_STAMP = 50;

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
            const signOutMessage = '<img src="' + imgURL + '" width="35px" height="auto"><button class="btn btn-outline-danger" type="submit"  onClick="signOut()">Sign out<\/button>';
            $('#auth').append(signOutMessage);
            const bathBtn = '<button class="btn put-stamp">Take a Bath</button>';
            $('.card-front').append(bathBtn);

            var stamp = 0;
            var lastClickedDate = null;
            var ref = firebase.firestore().collection('user').doc(user.uid);

            ref
                .get()
                .then((doc) => {
                    // Get Stamp count from firestore
                    if (doc.exists) {
                        stamp = doc.data().stamp;
                        lastClickedDate = new Date(doc.data().lastClickedDate);
                        console.log("-- read --");
                        console.log("stamp: " + stamp);
                        console.log("lastClickedDate: " + lastClickedDate);
                    } else {
                        lastClickedDate = new Date('1900-01-01T00:00:00');
                        console.log("-- read --");
                        console.log("no data");
                    }

                    // Check Date
                    if (new Date().getYear() === lastClickedDate.getYear() &&
                        new Date().getMonth() === lastClickedDate.getMonth() &&
                        new Date().getDate() === lastClickedDate.getDate()) {
                        $(".put-stamp").prop('disabled', true);
                        $(".put-stamp").html('Already Bathed');
                    }

                    // Create Image Table
                    for (let i = 1; i <= MAX_STAMP; i++) {
                        if (i <= stamp) {
                            var num = Math.floor(Math.random() * 31) + 1;
                            firebase.storage().ref("stamp" + num + ".png").getDownloadURL().then((url) => {
                                $(".stamp" + i).append('<img src="' + url + '" class="back-stamp-img">');
                            });
                        } else {
                            $(".stamp" + i).append(i);
                        }
                    }
                });



            // Rotate card
            $('.card').on("click", function () {
                $(".card-front").toggleClass("reverse");
                $(".card-back").toggleClass("reverse");
            });

            // Click Bath Button
            $('.put-stamp').on("click", function (e) {
                e.stopPropagation();
                $(".put-stamp").prop('disabled', true);
                $(".put-stamp").html('Already Bathed');

                
                stamp++;
                if (MAX_STAMP < stamp) {
                    stamp = 1;
                    for (let i = 1; i <= MAX_STAMP; i++) {
                        $(".stamp" + i).empty();
                        $(".stamp" + i).append(i);
                    }
                }
                $(".stamp" + stamp).empty();

                $(".card-front").toggleClass("reverse");
                $(".card-back").toggleClass("reverse");

                // Add Stamp in back card
                var num = Math.floor(Math.random() * 31) + 1;
                firebase.storage().ref("stamp" + num + ".png").getDownloadURL().then((url) => {
                    $(".stamp" + stamp).append('<img src="' + url + '" class="back-stamp-img animation">');
                });

                // Write stamp count from firestore
                ref.get()
                    .then((doc) => {
                        if (doc.exists) {
                            ref
                                .update({
                                    "name": user.displayName,
                                    "stamp": stamp,
                                    "lastClickedDate": new Date().toString()
                                })
                                .then(() => {
                                    console.log("-- write --");
                                    console.log("stamp: " + stamp);
                                    console.log("lastClickedDate: " + new Date().toString());
                                });
                        } else {
                            ref
                                .set({
                                    "name": user.displayName,
                                    "stamp": stamp,
                                    "lastClickedDate": new Date().toString()
                                })
                                .then(() => {
                                    console.log("-- write --");
                                    console.log("stamp :" + stamp);
                                    console.log("lastClickedDate :" + new Date().toString());
                                });
                        }
                    })
            })
        } else {
            $("#auth").empty();
            const signInMessage = `
              <button class="btn btn-outline-primary" type="submit"  onClick="signIn()">Sign in<\/button>
              `;
            $('#auth').append(signInMessage);
        }
    });
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