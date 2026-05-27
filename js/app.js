
async function login() {

  const email =
    document.getElementById('email').value;

  const password =
    document.getElementById('password').value;

  const loading =
    document.getElementById('loading');

  loading.classList.remove('hidden');

  try {

    const response = await fetch(SCRIPT_URL, {

      method: 'POST',

      body: JSON.stringify({
        action: 'login',
        email,
        password
      })

    });

    const data = await response.json();

    if (!data.success) {

      document.getElementById(
        'loginError'
      ).innerText = data.message;

      loading.classList.add('hidden');

      return;
    }

    localStorage.setItem(
      'employeeData',
      JSON.stringify(data)
    );

    loadDashboard(data);

  } catch(error) {

    console.error(error);

    alert('Server Error');

  }

  loading.classList.add('hidden');
}

function loadDashboard(data) {

  document
    .getElementById('loginPage')
    .classList.add('hidden');

  document
    .getElementById('dashboardPage')
    .classList.remove('hidden');

  document.getElementById(
    'employeeName'
  ).innerText =
    data.employee.FirstName +
    ' ' +
    data.employee.LastName;

  document.getElementById(
    'employeePosition'
  ).innerText =
    data.employee.Position;

  document.getElementById(
    'employeeDepartment'
  ).innerText =
    data.employee.Department;

  document.getElementById(
    'taskCount'
  ).innerText =
    data.tasks.length;

  document.getElementById(
    'attendanceRate'
  ).innerText =
    data.attendanceSummary.OnTimePercentage + '%';

  document.getElementById(
    'workHours'
  ).innerText =
    data.attendanceSummary.TotalWorkHours;

  const container =
    document.getElementById('tasksContainer');

  container.innerHTML = '';

  data.tasks.forEach(task => {

    container.innerHTML += `

      <div class="bg-white p-5 rounded shadow">

        <div class="flex justify-between mb-3">

          <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
            ${task.Type}
          </span>

          <span class="text-red-500 text-sm">
            ${task.DueDate}
          </span>

        </div>

        <h3 class="font-bold text-lg mb-2">
          ${task.TaskID}
        </h3>

        <p class="text-gray-600 mb-4">
          ${task.Description}
        </p>

        <button
          onclick="completeTask('${task.TaskID}')"
          class="bg-green-500 text-white px-4 py-2 rounded"
        >
          Complete
        </button>

      </div>

    `;
  });
}

function completeTask(taskId) {

  alert('Task Completed: ' + taskId);
}

function logout() {

  localStorage.removeItem('employeeData');

  location.reload();
}

window.onload = () => {

  const saved =
    localStorage.getItem('employeeData');

  if (saved) {

    loadDashboard(JSON.parse(saved));

  }
}
