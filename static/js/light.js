//    // Select all elements with the class 'light_box_child'
//    const lightBoxChildren = document.querySelectorAll('.light_box_child');
    
//    // Add click event listener to each element
//    lightBoxChildren.forEach(child => {
//        child.addEventListener('click', () => {
//            // Toggle green background color on click
//            child.classList.toggle('light_blue_bg');
//        });
//    });



document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with the class 'light_box_child'
    const lightBoxChildren = document.querySelectorAll('.light_box_child');
    
    // Add click event listener to each element
    lightBoxChildren.forEach(child => {
        child.addEventListener('click', () => {
            // Toggle background color on click
            child.classList.toggle('light_blue_bg');
            
            // Determine the state from the background color
            const state = child.classList.contains('light_blue_bg') ? '1' : '0';
            const deviceId = child.dataset.deviceId;
            const command = `${deviceId}:${state}`;

            // Send the command to the server
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/light', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log('Light turned ' + JSON.parse(xhr.responseText).state);
                }
            };
            xhr.send('command=' + command);
        });
    });
});