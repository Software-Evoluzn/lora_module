   // Select all elements with the class 'light_box_child'
   const lightBoxChildren = document.querySelectorAll('.light_box_child');
    
   // Add click event listener to each element
   lightBoxChildren.forEach(child => {
       child.addEventListener('click', () => {
           // Toggle green background color on click
           child.classList.toggle('light_blue_bg');
       });
   });