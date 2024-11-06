//  ***************schedule js start**************

document.addEventListener('DOMContentLoaded', function () {
    // Initialize flatpickr for date range
    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "d/m/Y",
    });

    // Listen for changes in the date selection dropdown
    document.getElementById('dateSelect').addEventListener('change', function () {
        const dateRangeContainer = document.getElementById('dateRangeContainer');
        const weekly_day_range = document.getElementById('weekly_day_range');

        if (this.value === 'setDate') {
            // Show date range container if "Set Date" is selected
            dateRangeContainer.style.display = 'block';
            weekly_day_range.style.display = 'none'; // Hide weekly range if showing date range
        } else if (this.value === 'weekly') {
            // Show weekly day range if "Weekly" is selected
            weekly_day_range.style.display = 'block';
            dateRangeContainer.style.display = 'none'; // Hide date range if showing weekly range
        } else {
            // Hide both if "Today" is selected
            dateRangeContainer.style.display = 'none';
            weekly_day_range.style.display = 'none';
        }
    });
    document.getElementById('everyday-checkbox').addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('.day-checkbox');

        if (this.checked) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false; // Uncheck all individual day checkboxes
            });
        } else {
            const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            this.checked = !anyChecked; // Check "Every Day" if no other days are checked
        }
    });

    // Event listener for individual day checkboxes
    document.querySelectorAll('.day-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const everydayCheckbox = document.getElementById('everyday-checkbox');

            if (this.checked) {
                everydayCheckbox.checked = false; // Uncheck "Every Day" if any day is selected
            } else {
                const anyChecked = Array.from(document.querySelectorAll('.day-checkbox')).some(checkbox => checkbox.checked);
                everydayCheckbox.checked = !anyChecked; // Check "Every Day" if no other days are checked
            }
        });
    });

    // Set button click event
    document.getElementById('setScheduleBtn').addEventListener('click', function () {
        // const device = document.getElementById('deviceSelect').value;
        const dateOption = document.getElementById('dateSelect').value;
        const fromTime = document.getElementById('fromTime').value;
        const toTime = document.getElementById('toTime').value;

        // Clear the alerts div
        const alertsDiv = document.getElementById('alerts');
        alertsDiv.innerHTML = '';

        // Validate inputs
        let errors = [];

        // if (!device) {
        //   errors.push("Please select a device.");
        // }

        if (dateOption === 'setDate') {
            const dateRangeInput = document.getElementById('dateRange')._flatpickr.selectedDates;
            if (dateRangeInput.length !== 2) {
                errors.push("Please select a date range.");
            }
        }

        if (!fromTime) {
            errors.push("Please select a 'From' time.");
        }

        if (!toTime) {
            errors.push("Please select a 'To' time.");
        }

        // Proceed if no errors
        let selectedDate;
        if (dateOption === 'today') {
            const today = new Date();
            selectedDate = today.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
        } else if (dateOption === 'setDate') {
            const dateRangeInput = document.getElementById('dateRange')._flatpickr.selectedDates;
            const startDate = dateRangeInput[0].toLocaleDateString('en-GB');
            const endDate = dateRangeInput[1].toLocaleDateString('en-GB');
            selectedDate = `${startDate} - ${endDate}`; // Display as Start Date - End Date
        } else {
            // Handle weekly case
            const days = [];
            const checkboxes = weekly_day_range.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    days.push(checkbox.previousElementSibling.innerText);
                }
            });

            // Check if no days were selected
            if (days.length === 0) {
                errors.push("Please select at least one day for the weekly schedule."); // Add this line
            }

            selectedDate = days.length ? days.join(', ') : 'No days selected'; // Display selected days
        }

        // Display errors if there are any
        if (errors.length > 0) {
            const errorList = '<ul>' + errors.map(error => `<li>${error}</li>`).join('') + '</ul>';
            alertsDiv.innerHTML = errorList;
            return; // Stop the function from proceeding
        }

        // Create new schedule item HTML
        const scheduleItemHTML = `
  <div class="row schedule-item">
    <div class="col schedule_main_img_div" >
      <img src="../static/img/scheduled_led.png" alt="Scheduled Device">
       <div>device 123</div>

    </div>
    <div class="col schedule_device_date"  >${selectedDate}</div>
    <div class="col"  >${fromTime} - ${toTime}</div>
    <div class="col"  >
      <button class="schedule_delete_list">Delete</button>
    </div>
  </div>
`;

        // Append the new schedule item to the schedule list
        document.getElementById('scheduleList').insertAdjacentHTML('beforeend', scheduleItemHTML);

        // Clear the inputs after setting the schedule
        // document.getElementById('deviceSelect').value = '';
        document.getElementById('fromTime').value = '';
        document.getElementById('toTime').value = '';
        weekly_day_range.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false; // Reset checkboxes
        });
        alertsDiv.innerHTML = ''; // Clear alerts
    });

    // Event delegation for deleting schedule items
    document.getElementById('scheduleList').addEventListener('click', function (event) {
        if (event.target.classList.contains('schedule_delete_list')) {
            event.target.closest('.schedule-item').remove(); // Remove the respective schedule item
        }
    });
});

//  ***************schedule js end **************

// **************************************************

document.addEventListener('DOMContentLoaded', function() {
    // Master switch toggle
    const masterSwitch = document.querySelector('.toggle input');
    masterSwitch.addEventListener('change', function() {
        const command = masterSwitch.checked ? 'T:5:G:G:1' : 'T:5:G:G:0';
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('Master switch turned ' + JSON.parse(xhr.responseText).state);
                // Update all individual switches based on master switch state
                const individualSwitches = document.querySelectorAll('.individual-toggle');
                individualSwitches.forEach(function(switchElement) {
                    switchElement.checked = masterSwitch.checked;
                    if (masterSwitch.checked) {
                        switchElement.parentElement.querySelector('.toggle_span').style.backgroundColor = '#2B3674';
                    } else {
                        switchElement.parentElement.querySelector('.toggle_span').style.backgroundColor = '#ccc';
                    }
                });
            }
        };
        xhr.send('command=' + command);
    });
});