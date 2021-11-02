const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;

// Create element and render users
const renderUser = doc => {
  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().date}</td>
      <td>${doc.data().day}</td>
      <td>${doc.data().timeWokeUp}</td>
      <td>${doc.data().mood}</td>
      <td>${doc.data().work}</td>
      <td>${doc.data().hoursOfExercise}</td>
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
  `;
  tableUsers.insertAdjacentHTML('beforeend', tr);

  // Click edit user
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');

    id = doc.id;
    editModalForm.date.value = doc.data().date;
    editModalForm.day.value = doc.data().day;
    editModalForm.timeWokeUp.value = doc.data().timeWokeUp;
    editModalForm.mood.value = doc.data().mood;
    editModalForm.work.value = doc.data().work;
    editModalForm.hoursOfExercise.value = doc.data().hoursOfExercise;

  });

  // Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () => {
    db.collection('users').doc(`${doc.id}`).delete().then(() => {
      console.log('Document succesfully deleted!');
    }).catch(err => {
      console.log('Error removing document', err);
    });
  });

}

// Click add user button
btnAdd.addEventListener('click', () => {
  addModal.classList.add('modal-show');

  addModalForm.date.value = '';
  addModalForm.day.value = '';
  addModalForm.timeWokeUp.value = '';
  addModalForm.mood.value = '';
  addModalForm.work.value = '';
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
db.collection('users').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
      renderUser(change.doc);
    }
  })
})

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('users').add({
    date: addModalForm.date.value,
    day: addModalForm.day.value,
    timeWokeUp: addModalForm.timeWokeUp.value,
    mood: addModalForm.mood.value,
    work: addModalForm.work.value,
    hoursOfExercise: addModalForm.hoursOfExercise.value,
  });
  modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('users').doc(id).update({
    date: editModalForm.date.value,
    day: editModalForm.day.value,
    timeWokeUp: editModalForm.timeWokeUp.value,
    mood: editModalForm.mood.value,
    work: editModalForm.work.value,
    hoursOfExercise: editModalForm.hoursOfExercise.value,
  });
  editModal.classList.remove('modal-show');
  
});
