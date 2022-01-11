
const dbName = "mung";
const tableName = "memo";
const version = 3.0;

const request = indexedDB.open(dbName, version);
let d ;

request.onupgradeneeded = e => {
  // open(name, version)이 일치하는 데이터베이스가 없는 경우 호출
  // 데이터베이스를 생성함
  console.log('onupgradeneeded');

  const { result: db } = e.target;

  // 테이블 생성
  const store = db.createObjectStore(tableName, {keyPath: 'id'});
  
  const titleIndex = store.createIndex("by_title", "title", {unique: true});
  // const authorIndex = store.createIndex("by_author", "author");
}

request.onsuccess = e => {
  // open(name, version)이 일치하는 데이터베이스가 있는 경우 호출
  console.log('onsuccess');
  const { result: db } = e.target;
  d = db;
}

request.error = e => {
  // open(name, version)에서 name은 존재하지만 낮은 version 호출시 호출
  console.log('error');
}

document.getElementById('add').addEventListener('click', () => {
  const tx = d.transaction(tableName, 'readwrite')
  const store = tx.objectStore(tableName)

  const id = document.getElementById('id').value;
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  if (!id || !title || !body) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  store.put({
    id, 
    title, 
    body
  });
})

document.getElementById('key-path').addEventListener('click', () => {
  const keyPathId = document.getElementById('key-path-id').value;
  const tx = d.transaction(tableName, 'readonly')
  const store = tx.objectStore(tableName)
  const request = store.get(keyPathId.toString());
  request.onsuccess = e => {
    const { id, title, body } = request.result;
    render(id, title, body);
  }
})

document.getElementById('get-index').addEventListener('click', () => {
  const titleIndex = document.getElementById('index-title').value;
  const tx = d.transaction(tableName, 'readonly')
  const store = tx.objectStore(tableName)
  const index = store.index('by_title');
  const request = index.get(titleIndex);

  request.onsuccess = e => {
    const { id, title, body } = request.result;
    render(id, title, body);
  }
})

function render(id, title, body) {
  document.getElementById('search-id').innerText = id;
  document.getElementById('search-title').innerText = title;
  document.getElementById('search-body').innerText = body;
} 