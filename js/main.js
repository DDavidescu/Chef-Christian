function toggleSidebar() {
  const nav = document.querySelector('.navbar');
  const icon = document.querySelector('.menu-button i');
  const isOpen = nav.classList.toggle('nav-open');

  if (isOpen) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
}

function hideSidebar() {
  const nav = document.querySelector('.navbar');
  const icon = document.querySelector('.menu-button i');

  nav.classList.remove('nav-open');
  icon.classList.remove('fa-xmark');
  icon.classList.add('fa-bars');
}
