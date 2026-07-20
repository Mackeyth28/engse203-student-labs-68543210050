import './style.css';

const form = document.querySelector('#request-form');

// TODO 1: query preview/status/list elements
const status = document.querySelector('#form-status');
const list = document.querySelector('#request-list');

const preview = {
displayName: document.querySelector('#preview-name'),
learningRole: document.querySelector('#preview-role'),
learningGoal: document.querySelector('#preview-goal'),
};



// TODO 2: readForm()
function readForm() {
return Object.fromEntries(new FormData(form).entries());

}
// TODO 3: renderPreview(data)
function renderPreview(data) {

preview.displayName.textContent =
data.displayName.trim() || 'ยังไม่ระบุชื่อ';

preview.learningRole.textContent =
data.learningRole || 'ยังไม่เลือกบทบาท';

preview.learningGoal.textContent =
data.learningGoal.trim() || 'ยังไม่มีเป้าหมายการเรียนรู้';

goalCount.textContent = `${data.learningGoal.length} ตัวอักษร`;

}

// TODO 4: validate(data)
function validate(data) {
const errors = {};

if (data.displayName.trim().length < 2) {
errors.displayName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';

}

if (!data.learningRole) {
errors.learningRole = 'กรุณาเลือกบทบาทที่สนใจ';

}

if (data.learningGoal.trim().length < 10) {
errors.learningGoal = 'กรุณาเขียนเป้าหมายอย่างน้อย 10 ตัวอักษร';

}

return errors;

}
// TODO 5: renderErrors(errors)
function renderErrors(errors) {
for (const name of [
'displayName',
'learningRole',
'learningGoal',
]) {

const field = form.elements[name];

const output = document.querySelector(`#${name}-error`);

const message = errors[name] ?? '';
output.textContent = message;
field.setAttribute('aria-invalid', String(Boolean(message)));

}

}

function renderStatus(state, message) {
status.dataset.state = state;
status.textContent = message;

}

// TODO 6: input and submit listeners
form.addEventListener('input', () => {
const data = readForm();
renderPreview(data);
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    

    const data = readForm();
    const errors = validate(data);
    renderErrors(errors);

    if (Object.keys(errors).length > 0) {
        renderStatus('invalid', 'ยังบันทึกไม่ได้ กรุณาตรวจสอบข้อมูล');
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }

    renderStatus('success', `พร้อมแล้ว ${data.displayName}! ข้อมูลผ่านการตรวจสอบ`);

});
console.log('LAB 3 starter ready', form);
