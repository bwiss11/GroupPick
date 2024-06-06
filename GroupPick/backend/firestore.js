// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  addDoc,
} from "firebase/firestore";

import { ScreenStackHeaderConfig } from "react-native-screens";
import { getLocaleDirection } from "react-native-web/dist/cjs/modules/useLocale";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdTzGDjbAUQgy8NRhLdTSfSMbz21-sJu0",
  authDomain: "grouppick-74cf0.firebaseapp.com",
  projectId: "grouppick-74cf0",
  storageBucket: "grouppick-74cf0.appspot.com",
  messagingSenderId: "89195551212",
  appId: "1:89195551212:web:d9e338711c2baf3c0708c9",
  measurementId: "G-EXLBQ3SP17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const signUp = () => {
  createUserWithEmailAndPassword(auth, "emaily@email.com", "passwordtest")
    .then(() => {
      console.log("user created!");
    })
    .catch((e) => {
      console.log(e);
    });
};

// function GetGames2() {
//   const curDate = GetFormattedDate();
//   return fetch(
//     "https://statsapi.mlb.com/api/v1/schedule?sportId=1&hydrate=probablePitcher&startDate=" +
//       curDate +
//       "&endDate=" +
//       curDate
//   )
//     .then((res) => {
//       data = res.json();
//       return data;
//     })
//     .then((data) => {
//       return data.dates[0].games;
//     });
// }

const db = getFirestore(app);

// const userToPicksId = {
//   L2tcqkRGYEEHb20DVbv5: "JU9K63mDllpPQbDt1Gx9",
//   MJ53DXM7CXOzljAnlN5N: "gN6Pk4d81ocdGoXwlmnv",
//   rDjcAkiv1vq2pIzzPNoZ: "0PlJUzddfM5kKnAgis0k",
// };

async function createUserDoc(firebaseId, email, firstName, lastName) {
  await setDoc(doc(db, "users", firebaseId), {
    firebaseID: firebaseId,
    email: email,
    firstName: firstName,
    lastName: lastName,
    picUrl:
      "https://as2.ftcdn.net/v2/jpg/00/75/13/25/1000_F_75132523_xkLZqbPQkUvVzWSftTf3nAGBjBFkcKuP.jpg",
  });
  const docRef = await addDoc(collection(db, "users", firebaseId, "picks"), {});
}

async function logFirestorePicks(date, picks, userId, pickId) {
  // const res = await updateDoc(
  //   doc(db, "users", userId, "picks", pickId),
  //   {
  //     [date]: picks,
  //   },
  //   { merge: true }
  // );

  //
  // console.log("userId is", userId);

  // SPECIAL CODE FOR TESTING - logs user's picks for the whole group
  if (userId == "L2tcqkRGYEEHb20DVbv5") {
    let userInfo = await getUserInfo(userId);
    let groupID = userInfo.groupID;
    // console.log("groupID is", groupID);
    let groupData = await getGroup(groupID);
    let members = groupData.members;
    console.log("members are", members);

    for (let i = 0; i < members.length; i++) {
      // console.log("member", i, "is", members[i]);
      let memberId = members[i];
      // let memberInfo = await getUserInfo(memberId);
      let memberPicksDoc = await getUserPicksDoc(memberId);
      // console.log("member", memberId, "picks doc is", memberPicksDoc[0]);
      await updateDoc(
        doc(db, "users", memberId, "picks", memberPicksDoc[0]),
        {
          [date]: picks,
        },
        { merge: true }
      );
    }
  } else {
    let memberPicksDoc = await getUserPicksDoc(userId);
    await updateDoc(
      doc(db, "users", userId, "picks", memberPicksDoc[0]),
      {
        [date]: picks,
      },
      { merge: true }
    );
  }
  // PLACEHOLDER that logs the same picks for the whole group as the logged-in user's pick
  // const res1 = await updateDoc(
  //   doc(
  //     db,
  //     "users",
  //     "MJ53DXM7CXOzljAnlN5N",
  //     "picks",
  //     userToPicksId["MJ53DXM7CXOzljAnlN5N"]
  //   ),
  //   {
  //     [date]: picks,
  //   },
  //   { merge: true }
  // );
  // const res2 = await updateDoc(
  //   doc(
  //     db,
  //     "users",
  //     "rDjcAkiv1vq2pIzzPNoZ",
  //     "picks",
  //     userToPicksId["rDjcAkiv1vq2pIzzPNoZ"]
  //   ),
  //   {
  //     [date]: picks,
  //   },
  //   { merge: true }
  // );
  // PLACEHOLDER

  // return res;
}

async function logGroupFirestoreTranslatedPicks(
  date,
  picks,
  groupID,
  translatedPicksDocID
) {
  // PLACEHOLDER: group id and translated picks document id hardcoded
  console.log("picks", picks);
  const res = await updateDoc(
    doc(db, "groups", groupID, "picks", translatedPicksDocID),
    {
      [date]: picks,
    },
    { merge: true }
  );
  // PLACEHOLDER

  // return res;
}

async function logFirestoreData(date, data, groupID, groupDataDocID) {
  console.log("other data", date, data, groupID, groupDataDocID);
  // PLACEHOLDER: group id and data document id hardcoded
  const res = await updateDoc(
    doc(db, "groups", groupID, "data", groupDataDocID),
    {
      [date]: data,
    },
    { merge: true }
  );
  // PLACEHOLDER

  return res;
}

async function getFirestoreData(date, groupID, groupDataDocID) {
  const docSnap = await getDoc(
    doc(db, "groups", groupID, "data", groupDataDocID)
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return null;
  }
}

async function getFirestorePicks(date, groupID, groupPicksDocID) {
  const docSnap = await getDoc(
    doc(db, "groups", groupID, "picks", groupPicksDocID)
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return [];
  }
}

async function getTranslatedFirestorePicks(
  date,
  groupID,
  translatedPicksDocID
) {
  // console.log("Group id in translated is", groupID);
  const docSnap = await getDoc(
    doc(db, "groups", groupID, "picks", translatedPicksDocID)
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserFirestorePicks(date, userId, picksId) {
  let userPicksDocId = await getUserPicksDoc(userId);
  // console.log("userpicksdocid is", userPicksDocId);
  const docSnap = await getDoc(
    doc(db, "users", userId, "picks", userPicksDocId[0])
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return [];
  }
}

async function getGroup(groupID) {
  const docSnap = await getDoc(doc(db, "groups", groupID));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserInfo(userId) {
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserDoc(firebaseID) {
  usersRef = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersRef, where("firebaseID", "==", firebaseID, limit(1)))
  );
  let ans;

  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });

  return ans;
}

async function getGroupPicksDoc(groupID) {
  groupsRef = collection(db, "groups", groupID, "picks");
  const querySnapshot = await getDocs(
    query(groupsRef, where("type", "==", "genericPicks", limit(1)))
  );
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });

  return ans;
}

async function getTranslatedPicksDoc(groupID) {
  groupsRef = collection(db, "groups", groupID, "picks");
  const querySnapshot = await getDocs(
    query(groupsRef, where("type", "==", "translatedPicks", limit(1)))
  );
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });

  return ans;
}

async function getUserPicksDoc(userId) {
  picksRef = collection(db, "users", userId, "picks");
  const querySnapshot = await getDocs(query(picksRef, limit(1)));
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });
  return ans;
}

async function getGroupDataDoc(groupID) {
  picksRef = collection(db, "groups", groupID, "data");
  const querySnapshot = await getDocs(query(picksRef, limit(1)));
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });
  return ans;
}

async function checkPickAgreement(date, groupID, groupPicksDocID) {
  // console.log("Group id in CPA", groupID);
  console.log("checking pick agreement", date, groupID, groupPicksDocID);
  pickMap = {};
  groupPicks = [];

  for (let i = 0; i < 20; i++) {
    pickMap[i] = {
      awayML: 0,
      awaySpread: 0,
      homeML: 0,
      homeSpread: 0,
      over: 0,
      under: 0,
      optOut: 0,
    };
  }

  const docSnap = await getDoc(doc(db, "groups", groupID));
  // console.log("members are", docSnap.data().members);
  const members = docSnap.data().members;
  for (let i = 0; i < members.length; i++) {
    let memberPicksDoc = await getUserPicksDoc(members[i]);
    userPicks = await getUserFirestorePicks(date, members[i], memberPicksDoc);
    console.log("user picks are", userPicks);
    if (userPicks) {
      for (let j = 0; j < userPicks.length; j++) {
        // console.log("hi");
        // pickMap[i] = 1;
        // console.log("current value for that pick is", pickMap[i][userPicks[i]]);
        pickMap[j][userPicks[j]] = pickMap[j][userPicks[j]] + 1;
      }
    }
  }
  for (let i = 0; i < userPicks.length; i++) {
    obj = pickMap[i];
    let max = 0;
    let maxKey = "";

    for (let pick in obj) {
      if (obj[pick] > max) {
        max = obj[pick];
        maxKey = pick;
      }
    }
    groupPicks[i] = maxKey;
  }
  // PLACEHOLDER: groupID hardcoded
  const res = await updateDoc(
    doc(db, "groups", groupID, "picks", groupPicksDocID),
    {
      [date]: groupPicks,
    },
    { merge: true }
  );
  return groupPicks;
}

async function createGroup(userId, bankroll) {
  try {
    const docRef = await addDoc(collection(db, "groups"), {});
    console.log("created group", docRef.id);
    await updateDoc(
      doc(db, "groups", docRef.id),
      {
        password: docRef.id,
        groupID: docRef.id,
        members: [],
        bankroll: Number(bankroll),
        unitSize: Number(bankroll / 100),
      },
      { merge: true }
    );
    console.log("docref id is", docRef.id);
    const dataRef = await addDoc(
      collection(db, "groups", docRef.id, "data"),
      {}
    );
    await updateDoc(
      doc(db, "groups", docRef.id, "data", dataRef.id),
      {
        type: "translatedPicks",
      },
      { merge: true }
    );
    const picksRef = await addDoc(
      collection(db, "groups", docRef.id, "picks"),
      {}
    );
    await updateDoc(
      doc(db, "groups", docRef.id, "picks", picksRef.id),
      {
        type: "genericPicks",
      },
      { merge: true }
    );
    const translatedPicksRef = await addDoc(
      collection(db, "groups", docRef.id, "picks"),
      {}
    );
    await updateDoc(
      doc(db, "groups", docRef.id, "picks", translatedPicksRef.id),
      {
        type: "translatedPicks",
      },
      { merge: true }
    );

    await joinGroup(docRef.id, userId);
    return docRef.id;
  } catch (e) {
    console.error(e);
  }
}
// firebase.initializeApp(configuration);

async function joinGroup(groupID, userId) {
  // const docRef = await addDoc(collection(db, "groups"), {});

  console.log("member", userId, "is joining group", groupID);

  const retrievedDoc = await getDoc(doc(db, "groups", groupID));
  let members = retrievedDoc.data().members;

  try {
    if (members) {
      members.push(userId);
    } else {
      members = [userId];
    }
    await updateDoc(
      doc(db, "groups", groupID),
      {
        members: members,
      },
      { merge: true }
    );

    await updateDoc(
      doc(db, "users", userId),
      {
        groupID: groupID,
      },
      { merge: true }
    );

    return groupID;
  } catch (e) {
    console.error(e);
  }
}

async function recordOdds(date, hours, odds) {
  console.log("recording odds", date, hours, odds);
  oddsRef = collection(db, "odds");
  let ans;
  const querySnapshot = await getDocs(
    query(oddsRef, where("date", "==", date, limit(1)))
  );
  if (!querySnapshot.empty) {
    await querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ans = [doc.id, doc.data()];
    });
    console.log(
      "got doc",
      ans[0],
      ans[1],
      "hours",
      ans[1].hours,
      ans[1].hours == hours
    );
    // Only updates odds if odds for this hour have not been already recorded
    if (ans[1].hours != hours) {
      console.log("updating odds for hour", hours, odds, date, ans);
      await updateDoc(
        doc(db, "odds", ans[0]),
        {
          odds: odds,
          date: date,
          hours: hours,
        },
        { merge: true }
      );
    } else {
      console.log("don't need to update odds");
    }
  } else {
    // Create odds collection and add odds
    const docRef = await addDoc(collection(db, "odds"), {});
    console.log("created odds", docRef.id, odds, date, hours);
    await updateDoc(
      doc(db, "odds", docRef.id),
      {
        odds: odds,
        date: date,
        hours: hours,
      },
      { merge: true }
    );
  }
}

// const db = firebase.firestore();

export {
  app,
  db,
  logFirestorePicks,
  getFirestorePicks,
  getGroup,
  getUserInfo,
  getUserFirestorePicks,
  checkPickAgreement,
  logGroupFirestoreTranslatedPicks,
  getTranslatedFirestorePicks,
  logFirestoreData,
  getFirestoreData,
  signUp,
  getUserDoc,
  getUserPicksDoc,
  getGroupPicksDoc,
  getTranslatedPicksDoc,
  getGroupDataDoc,
  createUserDoc,
  createGroup,
  joinGroup,
  recordOdds,
};

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDdTzGDjbAUQgy8NRhLdTSfSMbz21-sJu0",
//   authDomain: "grouppick-74cf0.firebaseapp.com",
//   projectId: "grouppick-74cf0",
//   storageBucket: "grouppick-74cf0.appspot.com",
//   messagingSenderId: "89195551212",
//   appId: "1:89195551212:web:d9e338711c2baf3c0708c9",
//   measurementId: "G-EXLBQ3SP17"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
