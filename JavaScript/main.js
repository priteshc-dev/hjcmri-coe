// Toggle Social Sidebar 
function toggleSocialSidebar() {
  document.querySelector('.social-sidebar').classList.toggle('active');
}

// Navbar scroll effect -----------------------------------------------------------------------------------------------------------//

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Center last project card if odd number------------------------------------------------------------------------------------------//

document.addEventListener("DOMContentLoaded", function () {
  const projectRows = document.querySelectorAll(".projects-section .row");

  projectRows.forEach(row => {
    const cards = row.querySelectorAll(".col-md-6");
    const cardCount = cards.length;

    cards.forEach(card => card.classList.remove("offset-md-3"));

    if (cardCount % 2 !== 0) {
      const lastCard = cards[cardCount - 1];
      lastCard.classList.add("offset-md-3");
    }
  });
});

// Vacancy Sidebar - Visible only during specified date and only on index.html -----------------------------------------------------//

const startDate = new Date("2025-07-25");
const endDate = new Date("2025-08-20");
const today = new Date();
// ✅ URL check to ensure it's index.html
const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname === "/HCJMRI/" || window.location.pathname === "/index.html";

if (today >= startDate && today <= endDate && isHomePage) {
  const vacancySidebar = document.createElement('a');
  vacancySidebar.href = "career with us.html";
  vacancySidebar.className = "vacancy-sidebar";
  vacancySidebar.title = "New Vacancy Alert - Click to View";
  vacancySidebar.innerText = "Vacancy Alert";
  document.body.appendChild(vacancySidebar);
  // 10 second madhe hide 
  setTimeout(() => {
    vacancySidebar.classList.add('vacancy-hide');
    setTimeout(() => {
      vacancySidebar.style.display = 'none';
    }, 500); // fade-out time
  }, 10000);
}

// Counters js Section here ---------------------------------------------------------------------------------------------------------//

const counters = document.querySelectorAll('.counter');
const animateCounters = () => {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / 100;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target + '+';
      }
    };
    updateCount();
  });
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.disconnect(); // Run only once
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
observer.observe(statsSection);



// Success Stories Page Hover Msg js-----------------------------------------------------------------------------------------------//

function showHoverMessage() {
  document.getElementById("hoverMessage").classList.add("show");
}

function hideHoverMessage() {
  document.getElementById("hoverMessage").classList.remove("show");
}



// Donation Appeals js -------------------------------------------------------------------------------------------------------------//


document.addEventListener('DOMContentLoaded', () => {
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('customAmount');
  const qrCodeDiv = document.getElementById('qrCode');
  const paymentMessage = document.getElementById('paymentMessage');
  const form = document.getElementById('donationForm');

  const donorNameInput = document.getElementById('donorName');
  const donorEmailInput = document.getElementById('donorEmail');
  const donorPhoneInput = document.getElementById('donorPhone');
  const donorPanInput = document.getElementById('donorPan');

  let selectedAmount = '';

  function generateUPILink(amount) {
    const upiId = "yourupiid@bank";
    const payeeName = "Your Organization";
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
  }

  // PAN validation function
  function isValidPAN(pan) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  }

  // Contact number validation function
  function isValidContact(number) {
    return /^[6-9]\d{9}$/.test(number);
  }

  // Email validation function
  function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  // Force uppercase in PAN input and clear error
  donorPanInput.addEventListener('input', () => {
    donorPanInput.value = donorPanInput.value.toUpperCase();
    paymentMessage.textContent = '';
  });

  // Clear error messages for contact and email on input
  donorPhoneInput.addEventListener('input', () => paymentMessage.textContent = '');
  donorEmailInput.addEventListener('input', () => paymentMessage.textContent = '');

  // Select amount button
  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = btn.textContent.trim();
      customAmountInput.value = selectedAmount;
      qrCodeDiv.style.display = 'none';
      qrCodeDiv.innerHTML = '';
      paymentMessage.textContent = '';
    });
  });

  // Custom amount typed
  customAmountInput.addEventListener('input', () => {
    amountButtons.forEach(b => b.classList.remove('active'));
    selectedAmount = customAmountInput.value;
    qrCodeDiv.style.display = 'none';
    qrCodeDiv.innerHTML = '';
    paymentMessage.textContent = '';
  });

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = donorNameInput.value.trim();
    const email = donorEmailInput.value.trim();
    const phone = donorPhoneInput.value.trim();
    let pan = donorPanInput.value.trim().toUpperCase();
    donorPanInput.value = pan; // Ensure input is uppercase visually
    const amount = selectedAmount || customAmountInput.value;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      paymentMessage.textContent = "Please select or enter a valid amount.";
      return;
    }

    if (!name || !email || !phone || !pan) {
      paymentMessage.textContent = "Please fill in Full Name, Email, Phone, and PAN Card No.";
      return;
    }

    if (!isValidPAN(pan)) {
      paymentMessage.textContent = "Invalid PAN entered. Please check your PAN number and enter a valid one to proceed.";
      donorPanInput.focus();
      return;
    }

    if (!isValidContact(phone)) {
      paymentMessage.textContent = "Invalid contact number. Please enter a valid 10-digit mobile number to proceed.";
      donorPhoneInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      paymentMessage.textContent = "Invalid email address. Please check your email and enter a valid one to proceed.";
      donorEmailInput.focus();
      return;
    }

    // Show QR Code
    showQRCode(amount);

    // Razorpay Integration
    const options = {
      key: "rzp_test_8XAjCXRo92Ij1D", // Replace with actual key
      amount: Number(amount) * 100, // In paise
      currency: "INR",
      name: "HCJMRI",
      description: "Donation",
      handler: function (response) {
        paymentMessage.innerHTML = `<div class="alert alert-success">Thank you! Payment ID: ${response.razorpay_payment_id}</div>`;
        qrCodeDiv.style.display = 'none';
        form.reset();
        amountButtons.forEach(b => b.classList.remove('active'));
        selectedAmount = '';
        document.body.style.overflow = 'auto';
      },
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      theme: {
        color: "#0d6efd"
      },
      modal: {
        ondismiss: function () {
          document.body.style.overflow = 'auto';
          location.reload();
        }
      }
    };

    const rzp = new Razorpay(options);
    document.body.style.overflow = 'hidden';
    rzp.open();
  });

  function showQRCode(amount) {
    qrCodeDiv.style.display = 'block';
    qrCodeDiv.innerHTML = '';
    const upiLink = generateUPILink(amount);
    QRCode.toCanvas(upiLink, { width: 180 }, function (error, canvas) {
      if (error) {
        qrCodeDiv.textContent = "QR code generation failed.";
        return;
      }
      qrCodeDiv.appendChild(canvas);
    });
  }
});



// Where we work section js-------------------------------------------------------------------------------------------------------- //

function showMap(location) {
  var mapUrls = {
    'pune': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50901.62997639402!2d73.85289969114342!3d18.515960739362427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c05816d29283%3A0xfe98c3452724e113!2sJehangir%20Hospital!5e0!3m2!1sen!2sin!4v1752229271906!5m2!1sen!2sin', // Pune Map URL
    'kolhapur': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15286.229631435108!2d74.23821036361056!3d16.69901697276099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc10041936bb903%3A0x7e99f80ef61451c3!2sRevolution!5e0!3m2!1sen!2sin!4v1752229415673!5m2!1sen!2sin', // Kolhapur Map URL
    'nagpur': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40903.344451505756!2d79.06174915838056!3d21.139751563215693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c1faf48bfda9%3A0x616423bbbcdd76e9!2sSilver%20lining%20Pediatric%20Super%20Speciality%20Center%20for%20Growth%20Development%20Endocrine%20Care!5e0!3m2!1sen!2sin!4v1752229322785!5m2!1sen!2sin', // Nagpur Map URL
    'ranjangaon': 'https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d277413.90739234263!2d74.13539428834277!3d18.7256879638421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m5!1s0x3bc32965fc56b245%3A0xe2d82837be6df72b!2sRanjangaon%20MIDC%2C%20Maharashtra%20412220!3m2!1d18.7826998!2d74.2795524!4m0!5e1!3m2!1sen!2sin!4v1753261946704!5m2!1sen!2sin' //Ranjangaon Map URL
  };
  document.getElementById('mapFrame').src = mapUrls[location];
  document.getElementById('mapModal').style.display = 'block';
}

function closeMap() {
  document.getElementById('mapModal').style.display = 'none';
}




// Individual page JS Start here -----------------------------------------------------------------------------------------------------//

const galleryImages = document.querySelectorAll('.image-gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

galleryImages.forEach(img => {
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
  });
});

function closeLightbox() {
  lightbox.style.display = 'none';
}


// Event Section JS  Start here ---------------------------------------------------------------------------------------------------//

function openModal(src) {
  document.getElementById('modal-img').src = src;
  document.getElementById('modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}



// Pregnancy Weight Gain Calculator ---------------------------------------------------------------------------------------------- //
function calculate() {
  const fullname = document.getElementById("fullname").value.trim();
  const preWeight = parseFloat(document.getElementById("weight").value);
  const currentWeight = parseFloat(document.getElementById("currentWeight").value);
  const heightCm = parseFloat(document.getElementById("height").value);
  const lmpInput = document.getElementById("lmp").value;
  const measurementInput = document.getElementById("measurementDate").value;

  const outputDiv = document.getElementById("output");

  if (!fullname || !preWeight || !currentWeight || !heightCm || !lmpInput) {
    outputDiv.innerHTML = "<span style='color:red;'>Please fill in all fields.</span>";
    return;
  }

  const lmpDate = new Date(lmpInput);
  const today = measurementInput ? new Date(measurementInput) : new Date();

  if (isNaN(lmpDate) || isNaN(today)) {
    outputDiv.innerHTML = "<span style='color:red;'>Invalid date input.</span>";
    return;
  }

  if (today < lmpDate) {
    outputDiv.innerHTML = "<span style='color:red;'>Date of Measurement cannot be before LMP.</span>";
    return;
  }

  const heightM = heightCm / 100;
  const bmi = preWeight / (heightM * heightM);

  const diffMs = today - lmpDate;
  const gestDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const gestWeeksFloat = gestDays / 7;
  const gestWeeks = Math.floor(gestWeeksFloat);
  const extraDays = Math.round((gestWeeksFloat - gestWeeks) * 7);

  let trimester = "";
  if (gestWeeks < 14) trimester = "1st Trimester";
  else if (gestWeeks < 28) trimester = "2nd Trimester";
  else trimester = "3rd Trimester";

  const weightGain = currentWeight - preWeight;

  let category, totalRange, weeklyRange, weeklyMean;

  if (bmi < 18.5) {
    category = "Underweight";
    totalRange = [12.5, 18];
    weeklyRange = [0.44, 0.58];
    weeklyMean = 0.51;
  } else if (bmi < 25) {
    category = "Normal weight";
    totalRange = [11.5, 16];
    weeklyRange = [0.35, 0.5];
    weeklyMean = 0.42;
  } else if (bmi < 30) {
    category = "Overweight";
    totalRange = [7, 11.5];
    weeklyRange = [0.23, 0.33];
    weeklyMean = 0.28;
  } else {
    category = "Obese";
    totalRange = [5, 9];
    weeklyRange = [0.17, 0.27];
    weeklyMean = 0.22;
  }

  let totalStatus = "Adequate", totalStatusClass = "status-adequate";
  if (weightGain < totalRange[0]) {
    totalStatus = "Inadequate";
    totalStatusClass = "status-inadequate";
  } else if (weightGain > totalRange[1]) {
    totalStatus = "Excess";
    totalStatusClass = "status-excess";
  }

  let whoClass = "";
  if (bmi < 18.5) whoClass = "Underweight";
  else if (bmi < 25) whoClass = "Normal";
  else if (bmi < 30) whoClass = "Overweight";
  else whoClass = "Obese";

  let asiaClass = "";
  if (bmi < 18.5) asiaClass = "Underweight";
  else if (bmi < 23) asiaClass = "Normal";
  else if (bmi < 25) asiaClass = "Overweight";
  else asiaClass = "Obese";

  let southAsianClass = "";
  if (bmi < 18.5) southAsianClass = "Underweight";
  else if (bmi <= 23) southAsianClass = "Normal";
  else if (bmi < 27.5) southAsianClass = "Overweight";
  else southAsianClass = "Obese";

  let output = `
    <strong>Full Name:</strong> <span>${fullname}</span><br><br>
    <strong>Gestational Age:</strong> <span>${gestWeeks} weeks ${extraDays} days</span><br>
    <strong>Trimester:</strong> <span>${trimester}</span><br><br>

    <strong>Pre-pregnancy BMI:</strong> <span>${bmi.toFixed(1)}</span><br>
    <ul>
      <li><strong>WHO Classification:</strong> <span>${whoClass}</span></li>
      <li><strong>Asia-Pacific Classification:</strong> <span>${asiaClass}</span></li>
      <li><strong>South Asian Classification:</strong> <span>${southAsianClass}</span></li>
    </ul>
    <br>

    <strong>Recommended BMI Category (for weight gain):</strong> ${category}<br>
    <strong>Total Weight Gain:</strong> <span>${weightGain.toFixed(1)} kg</span>
      &rarr; <span class="${totalStatusClass}">${totalStatus}</span><br>
    <u>Recommended Total Weight Gain Range:</u> <span>${totalRange[0]} kg to ${totalRange[1]} kg</span><br>
  `;

  if (gestWeeks >= 14) {
    const weeksIn23Trimester = gestWeeksFloat - 14;
    const weeklyGain = weightGain / weeksIn23Trimester;

    let weeklyStatus = "Adequate", weeklyStatusClass = "status-adequate";
    if (weeklyGain < weeklyRange[0]) {
      weeklyStatus = "Inadequate";
      weeklyStatusClass = "status-inadequate";
    } else if (weeklyGain > weeklyRange[1]) {
      weeklyStatus = "Excess";
      weeklyStatusClass = "status-excess";
    }

    output += `
      <br>
      <strong>Weekly Gain (2nd/3rd Trimester):</strong> <span>${weeklyGain.toFixed(2)} kg/week</span>
        &rarr; <span class="${weeklyStatusClass}">${weeklyStatus}</span><br>
      <u>Recommended Weekly Gain Range:</u> <span>${weeklyRange[0]} kg/week to ${weeklyRange[1]} kg/week</span>
    `;
  } else {
    output += `<br>Weekly Gain (2nd/3rd Trimester): <em>Not applicable before 14 weeks.</em>`;
  }

  outputDiv.innerHTML = output;

  const section = document.getElementById('result-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}


// Publications Js Start Here -----------------------------------------------------------------------------------------------------// 

document.addEventListener("DOMContentLoaded", function () {
  const yearBlocks = document.querySelectorAll(".year-block");
  const publicationCounts = {};

  yearBlocks.forEach((block) => {
    const year = block.getAttribute("data-year");
    const publications = block.querySelectorAll(".card-publication");
    publicationCounts[year] = publications.length;
  });

  const ctx = document.getElementById("publicationChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(publicationCounts),
      datasets: [{
        label: "Number of Publications",
        data: Object.values(publicationCounts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });

  // Ensure only one collapse open at a time
  document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute("data-bs-target");
      document.querySelectorAll('.collapse').forEach(c => {
        if ("#" + c.id !== targetId) {
          const bsCollapse = bootstrap.Collapse.getInstance(c);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  });
});

// Search functionality
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const yearBlocks = document.querySelectorAll(".year-block");

  yearBlocks.forEach((yearBlock) => {
    const year = yearBlock.getAttribute("data-year");
    const publications = yearBlock.querySelectorAll(".card-publication");
    let matchFound = false;

    publications.forEach((pub) => {
      const text = pub.innerText.toLowerCase();
      if (text.includes(query) || year.includes(query)) {
        pub.closest(".card").style.display = "block";
        matchFound = true;
      } else {
        pub.closest(".card").style.display = "none";
      }
    });

    const collapseElement = yearBlock.querySelector(".collapse");
    if (matchFound) {
      // collapseElement.classList.add("show");
      yearBlock.style.display = "block";
    } else {
      collapseElement.classList.remove("show");
      yearBlock.style.display = "none";
    }
  });
});



// Award Section JS ----------------------------------------------------------------------------------------------------------------// 

// Open modal with clicked image
function openModal(imgElement) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modalImg.src = imgElement.src;
  modal.style.display = "flex";
}

// Close modal on clicking overlay
function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}


// // ------------------------ Loader Page  JS ----------------------- //

// window.addEventListener("load", function () {
//   const loader = document.getElementById("page-loader");
//   if (loader) {
//     loader.style.opacity = "0";
//     loader.style.transition = "opacity 0.5s ease";
//     setTimeout(() => {
//       loader.style.display = "none";
//     }, 3500); // 3.5 सेकंदांनी loader hide करा (animation पूर्ण होऊ द्या)
//   }
// });

