window.onload = async function() {
    const arr = await db.LEMs.toArray();
    for (const obj of arr) {
        document.querySelector('ol').innerHTML += '<li>' + JSON.stringify(obj) + '</li>';
    }
    const arrItems = await db.LEMItems.toArray();
    for (const obj of arrItems){
        document.querySelector('ul').innerHTML += '<li>' + JSON.stringify(obj) + '</li>';
    }
};