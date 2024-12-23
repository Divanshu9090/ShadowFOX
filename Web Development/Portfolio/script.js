const toggleButton = document.getElementById('bar');
const navbar = document.querySelector('.navbar');
const anchors = navbar.querySelectorAll('a');
const form = document.getElementById('contactForm');
const formFields = form.querySelectorAll(".item");
const aboutLinks = document.querySelectorAll('.link');
const emailInput = document.getElementById('email');
const result = document.getElementById('result');


toggleButton.addEventListener('click', () => navbar.classList.toggle('active'));

anchors.forEach(anchor => {
    anchor.addEventListener('click', event => {
        event.preventDefault();
        handleAnchorClick(anchor);
    });
});

window.addEventListener('scroll', highlightActiveSection);

form.addEventListener('submit', handleFormSubmit);

function handleAnchorClick(anchor) {
    updateActiveNavbarLink(anchor);
    smoothScrollToSection(anchor);
}

function updateActiveNavbarLink(anchor) {
    anchors.forEach(a => a.classList.remove('navbar-scrolled'));
    anchor.classList.add('navbar-scrolled');
}

function smoothScrollToSection(anchor) {
    const targetId = anchor.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    }
}

function highlightActiveSection() {
    let activeSection = null;
    const scrollPosition = window.scrollY + window.innerHeight;

    anchors.forEach(anchor => {
        const targetId = anchor.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const sectionTop = targetSection.offsetTop;
            const sectionHeight = targetSection.offsetHeight;

            if (scrollPosition >= sectionTop + (sectionHeight * 0.4) && scrollPosition <= sectionTop + sectionHeight + (sectionHeight * 0.4)) {
                activeSection = anchor;
            }
        }
    });

    anchors.forEach(anchor => {
        anchor.classList.toggle('navbar-scrolled', anchor === activeSection);
    });
}

aboutLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        handleAboutLinkClick(link);
    });
});

function handleAboutLinkClick(link) {
    aboutLinks.forEach(linkItem => {
        linkItem.classList.remove('select');
        const contentId = linkItem.innerText.toLowerCase();
        document.getElementById(contentId).classList.remove('data');
    });

    link.classList.add('select');
    const contentId = link.innerText.toLowerCase();
    document.getElementById(contentId).classList.add('data');
}

function validateFormInputs() {
    
    for (const item of formFields) {
        if (item.value.trim() == "") {
            item.classList.add("border-red");
            item.nextElementSibling.classList.add("error");
        }
        if (email.value != "") {
            validateEmailInput();
        }
        email.addEventListener('keydown', () => {
            validateEmailInput();
        });
        item.addEventListener('keydown', () => {
            if (item.value.trim() != "") {
                item.classList.remove("border-red");
                item.nextElementSibling.classList.remove("error");
            } else {
                item.classList.add("border-red");
                item.nextElementSibling.classList.add("error");
            }
        });
    }
}

function validateEmailInput() {
    const emailRegex = /^[a-z\d\.-]+@[a-z\d-]+\.[a-z]{2,3}(\.[a-z]{2,3})?$/;
    if (!email.value.trim().match(emailRegex)) {
        email.classList.add('border-red');
        if (email.value.trim() != "") {
            email.nextElementSibling.innerText = "Enter a valid email address";
        } else {
            email.nextElementSibling.innerText = "Email Address can't be blank";
        }
        email.nextElementSibling.classList.add('error');
    } else {
        email.classList.remove('border-red');
        email.nextElementSibling.classList.remove('error');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    validateFormInputs();

    if (isFormValid()) {
        submitForm();
    }
}

function isFormValid() {
    return !Array.from(formFields).some(field => field.classList.contains('border-red'));
}

function submitForm() {
    const formData = new FormData(form);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.innerHTML = "Please wait..."

    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                Swal.fire({
                    title: "Success!",
                    text: json.message,
                    icon: "success"
                });
                result.innerHTML="";
            } else {
                console.log(response);
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.innerHTML="";
            }, 3000);
        });
}