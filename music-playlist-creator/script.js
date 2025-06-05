document.querySelectorAll('.playlist-card').forEach((card) => {
   card.addEventListener('click', function(){
      document.querySelector('.modal-overlay').style.display = 'block';
   });
});

document.querySelector('.close').addEventListener('click', function() {
   document.querySelector('.modal-overlay').style.display = 'none';
});

window.addEventListener('click', function(event) {
   if (event.target.classList.contains('modal-overlay')) {
      document.querySelector('.modal-overlay').style.display = 'none';
   }
});
