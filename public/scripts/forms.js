let CATEGORIES = null;
const EXPENSE_ACTIONS = [
    {
        title: "Chỉnh sửa",
        image: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg>`,
    },
    {
        title: "Xóa",
        image: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
        </svg>`,
    },
];

function getExpenseFields(categories, isForm = true) {
    let expenseFields = [
        {
            name: "title",
            title: "Tiêu đề",
            required: true,
            type: "text",
        },
        {
            name: "amount",
            title: "Lượng tiền",
            required: true,
            type: "number",
        },
        {
            name: "spent_date",
            title: "Ngày chi tiêu",
            required: false,
            type: "date",
        },
        {
            name: "category_id",
            title: "Loại chi tiêu",
            required: false,
            type: "select",
            children: categories,
        },
        {
            name: "description",
            title: "Mô tả",
            required: false,
            type: "textarea",
        },
    ];

    if (!isForm) {
        const fields = {
            id: {
                title: "STT",
            },
        };
        expenseFields.forEach((obj) => {
            fields[obj.name] = {
                title: obj.title,
            };

            if (obj.name === "category_id") {
                fields["category_id"]["mapping"] = categories;
            }
        });
        return fields;
    }

    return expenseFields;
}

async function getExpenseFormFields() {
    if (isBlank(CATEGORIES)) {
        CATEGORIES = await getJSONData("categories/");
    }

    const adaptedCategoriesData = selectAdapter(CATEGORIES, "id", "name");

    return getExpenseFields(adaptedCategoriesData);
}

async function getExpenseTableFields() {
    if (isBlank(CATEGORIES)) {
        CATEGORIES = await getJSONData("categories/");
    }

    const fields = getExpenseFields(CATEGORIES, (isForm = false));
    return fields;
}

function getBudgetTableFields(isForm = true) {
    let budgetFields = [
        {
            name: "source",
            title: "Nguồn thu nhập",
            required: true,
            type: "text",
        },
        {
            name: "amount",
            title: "Lượng tiền",
            required: true,
            type: "number",
        },
        {
            name: "receive_date",
            title: "Ngày nhận",
            required: true,
            type: "date",
        },
        {
            name: "notes",
            title: "Ghi chú",
            required: false,
            type: "text",
        },
    ];

    if (!isForm) {
        const fields = {
            id: {
                title: "STT",
            },
        };
        budgetFields.forEach((obj) => {
            fields[obj.name] = {
                title: obj.title,
            };
        });
        return fields;
    }

    return budgetFields;
}

function createFormFields(parentElement, fields) {
    fields.forEach((field) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("mb-3");

        const label = document.createElement("label");
        label.innerText = field.title;
        label.classList.add("form-label");

        let formField = null;

        if (field.type === "select") {
            formField = document.createElement("select");
            formField.classList.add("form-select");
            field.children.forEach((children) => {
                const option = document.createElement("option");
                option.value = children.value;
                option.innerText = children.title;
                formField.appendChild(option);
            });
        } else if (field.type === "textarea") {
            formField = document.createElement("textarea");
            formField.classList.add("form-control");
        } else {
            formField = document.createElement("input");
            formField.classList.add("form-control");
        }

        formField.name = field.name;
        formField.id = field.name;
        formField.type = field.type;
        formField.required = field.required;

        if (field.type === "date") {
            formField.value = new Date().toISOString().slice(0, 10);
        }

        wrapper.appendChild(label);
        wrapper.appendChild(formField);

        parentElement.appendChild(wrapper);
    });
}

function createExpenseActionCol(expense_id) {
    const actionCol = document.createElement("td");

    const row = document.createElement("div");
    row.classList.add('row');
    EXPENSE_ACTIONS.forEach(({title, image}) => {
        const icon = document.createElement("div");
        icon.classList.add('col');
        icon.innerHTML = image;
        icon.title = title;

        icon.addEventListener('click', () => {
            const currentExpense = document.getElementById(`expense_${expense_id}`);
            if(!currentExpense){
                return;
            }

            deleteExpense(expense_id).then((res) => {
                if(res.success){
                    currentExpense.remove();
                    alert('Thực hiện yêu cầu thành công');
                }
                else{
                    alert('Vui lòng thử lại');
                }
            }).catch((err) => alert('Thực hiện yêu cầu thất bại.'));
        });

        row.appendChild(icon);
    });

    actionCol.appendChild(row);

    return actionCol;
}

async function addExpenseRow(parentElement, data, index = null) {
    const fields = await getExpenseTableFields();

    const newRow = document.createElement("tr");
    newRow.id = `expense_${data.id}`;

    Object.keys(fields).forEach((key) => {
        const newCol = document.createElement("td");
        if (!isBlank(index) && key === "id") {
            newCol.innerText = index + 1;
        } else if (key === "amount") {
            newCol.innerText = data[key]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else if (key === "category_id") {
            newCol.innerText = fields[key].mapping.filter(
                (cate) => cate.id === data.category_id
            )[0].name;
        } else {
            newCol.innerText = data[key];
        }

        newRow.appendChild(newCol);
    });

    const actionCol = createExpenseActionCol(data.id);

    newRow.appendChild(actionCol);

    parentElement.appendChild(newRow);
    return newRow;
}

function addBudgetRow(parentElement, data, index = null) {
    const fields = getBudgetTableFields(false);

    const newRow = document.createElement("tr");
    newRow.id = data.id;

    Object.keys(fields).forEach((key) => {
        const newCol = document.createElement("td");

        if (!isBlank(index) && key === "id") {
            newCol.innerText = index + 1;
        } else if (key === "amount") {
            newCol.innerText = data[key]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else if (key === "source") {
            newCol.innerText = data.source.name;
        } else {
            newCol.innerText = data[key] || "--";
        }
        newRow.appendChild(newCol);
    });

    parentElement.appendChild(newRow);
    return newRow;
}

async function createExpensesTable(bodyElement, data) {
    data.forEach((row, index) => {
        addExpenseRow(bodyElement, row, index);
    });
}

function getCacheCategories() {
    return CATEGORIES;
}

function createBudgetTable(bodyElement, data) {
    data.forEach((row, index) => {
        addBudgetRow(bodyElement, row, index);
    });
}
