import { initializeApp } from "firebase/app"
import { 
    getFirestore, collection, /*getDocs*/ onSnapshot,
    addDoc, deleteDoc, doc,
    query, orderBy
  } from "firebase/firestore"

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };

// Iniciando fireBaseApp e serviços
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore();

// Collection && Query 
  const colRef = collection(db, 'cafes')
  const q = query(colRef, orderBy('local', 'asc'))

// Elementos HTML

  const cafeList = document.getElementById('cafe-list');
  function renderCafe(doc: any) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let local = document.createElement('span');
    let cross = document.createElement('div');
     
    li.setAttribute('data-id', doc.id); // doc.data.id, não é necessário o data por não estar armazenado em data
    name.textContent = doc.data().name;
    local.textContent = doc.data().local;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(local);
    li.appendChild(cross);

    cafeList.appendChild(li);

// Deletando Dados
    cross.addEventListener('click', (e) => {
      let target = e.target as HTMLLIElement
      const id: string = target.parentElement.getAttribute('data-id') // Já está pegando o id de cada li // value does not exist on type string
      
      const docRef = colRef 
      deletePlease(docRef, id)
  })
}

// Delete Please
  function deletePlease(d: any, id: any) {
     d = doc(db, 'cafes', id) 
      deleteDoc(d).then(() => {
        console.log('deleted :)')
      }).catch((err) => {
        console.log(err.message)
      })
  }

// Pegando dados em tempo real
  onSnapshot(q, (snapshot) => { // função irá rodar sempre que houver uma mudança
    let changes:any = snapshot.docChanges()
        
    for (let change of changes) { 
      if (change.type == 'added') {
        renderCafe(change.doc)
      } else if (change.type == 'removed') {
        let li = cafeList.querySelector('[data-id=' + change.doc.id + ']')
        cafeList.removeChild(li)
      }
    }
  })

// Adicionando Dados
  const addCafe: any = document.getElementById('add-cafe-form') as HTMLFormElement;
  addCafe.addEventListener('submit', (e: any) => {
    e.preventDefault();  // cancela evento, sem parar sua propagação

    addDoc(colRef, {
      name: addCafe.name.value,
      local: addCafe.local.value,
    }).then(() => {
      addCafe.reset()
    }).catch((err) => {
      console.log(err.message)
    })
  })

