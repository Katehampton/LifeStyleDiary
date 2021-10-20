const modalWrapper = document.querySelector('.modal-wrapper');

// modal add
const addModal = document.querySelector('.add-modal');

const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');

const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');


const tableUsers2 = document.querySelector('.table-users');
const tableUsers3 = document.querySelector('.table-users3');

let id;

// Create element and render users
const renderUser = doc => {
  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().date}</td>
      <td>${doc.data().day}</td>
      <td>${doc.data().timeWokeUp}</td>
      <td>${doc.data().mood}</td>
      <td>${doc.data().calories}</td>
      <td>${doc.data().hoursOfExercise}</td>
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
  `;
  tableUsers2.insertAdjacentHTML('beforeend', tr);

  // Click edit user
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');

    id = doc.id;
    editModalForm.date.value = doc.data().date;
    editModalForm.day.value = doc.data().day;
    editModalForm.timeWokeUp.value = doc.data().timeWokeUp;
    editModalForm.mood.value = doc.data().mood;
    editModalForm.calories.value = doc.data().calories;
    editModalForm.hoursOfExercise.value = doc.data().hoursOfExercise;

  });

  // Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () => {
    db.collection('lifeStyle').doc(`${doc.id}`).delete().then(() => {
      console.log('Document succesfully deleted!');
    }).catch(err => {
      console.log('Error removing document', err);
    });
  });

}
//prt 2
const renderUser3 = doc => {
  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().date}</td>
      <td>${doc.data().day}</td>
      <td>${doc.data().timeWokeUp}</td>
      <td>${doc.data().mood}</td>
      <td>${doc.data().calories}</td>
      <td>${doc.data().hoursOfExercise}</td>
    </tr>
  `;
  tableUsers3.insertAdjacentHTML('beforeend', tr);


}



// Click add user button
btnAdd.addEventListener('click', () => {
  addModal.classList.add('modal-show');

  addModalForm.date.value = '';
  addModalForm.day.value = '';
  addModalForm.timeWokeUp.value = '';
  addModalForm.mood.value = '';
  addModalForm.calories.value = '';
  addModalForm.hoursOfExercise.value = '';
});


// User click anyware outside the modal
// If e.target is equal too addModal we need to remove the modal show class - this means when you click outside the modal it will disapear
window.addEventListener('click', e => {
  if(e.target === addModal) {
    addModal.classList.remove('modal-show');
  }
  if(e.target === editModal) {
    editModal.classList.remove('modal-show');
  }
});



// Get all users
// db.collection('users').get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     renderUser(doc);
//   })
// });

// Real time listener
db.collection('lifeStyle').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers2.removeChild(tbody);
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers2.removeChild(tbody);
      renderUser(change.doc);
    }
  })
})

// Real time listener
db.collection('lifeStyle').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser3(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers3.removeChild(tbody);
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers3.removeChild(tbody);
      renderUser3(change.doc);
    }
  })
})


// Click submit in add modal
addModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('lifeStyle').add({
    date: addModalForm.date.value,
    day: addModalForm.day.value,
    timeWokeUp: addModalForm.timeWokeUp.value,
    mood: addModalForm.mood.value,
    calories: addModalForm.calories.value,
    hoursOfExercise: addModalForm.hoursOfExercise.value,
  });
  modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('lifeStyle').doc(id).update({
    date: editModalForm.date.value,
    day: editModalForm.day.value,
    timeWokeUp: editModalForm.timeWokeUp.value,
    mood: editModalForm.mood.value,
    calories: editModalForm.calories.value,
    hoursOfExercise: editModalForm.hoursOfExercise.value,
  });
  editModal.classList.remove('modal-show');
  
});
