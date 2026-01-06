// index.js
console.log('neon-relics loaded');

document.addEventListener('DOMContentLoaded', ()=>{
  const h = document.querySelector('h1');
  if(h) h.addEventListener('click', ()=> alert('Welcome to Neon Relics'));
});
