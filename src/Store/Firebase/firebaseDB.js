import { store } from '../index'
import actionTypes from '../actionTypes';
import DBActions from '../Actions/DBActions/DBActions';
export default class FirebaseDB {
   
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
        console.log(childSnapshot.val())
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};