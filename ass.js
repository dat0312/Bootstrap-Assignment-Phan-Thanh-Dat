const DB_KEYS = {
  SERVICES_DATA: 'storage_services',
  TESTIMONIALS_DATA: 'storage_testimonials'
};

const defaultServices = [
  {
    id: 1,
    title: 'Lorem Ipsum Dolor',
    content: 'Prawident amil minus qui consensusta non arms masses Eos amusantium mmas cilors',
    icon: 'bi-briefcase'
  },
  {
    id: 2,
    title: 'Eosle Commodi',
    content: 'Ut excepturi vokątaniem nie. Quidem uge commequitur. Mouse aut qui id voluptas',
    icon: 'bi-card-checklist'
  },
  {
    id: 3,
    title: 'Ledo Markt',
    content: 'Ut autem aut mutent non a Sint sind sit facilis Hats sint, Libern corrupti neque eum',
    icon: 'bi-bar-chart'
  },
  {
    id: 4,
    title: 'Asperiores Commodit',
    content: 'Non-et tamporibus mus omnes sed dolor comquatie Canditane sedem es fuga',
    icon: 'bi-binoculars'
  },
  {
    id: 5,
    title: 'Velit Doloremque',
    content: 'Durique et suscipit saepe. Esf maiores autem sur foolio ut aut insam corporis',
    icon: 'bi-brightness-high'
  },
  {
    id: 6,
    title: 'Dolori Architecto',
    content: 'Hic molestianes quibusitam eos fugiat smim dolararoque aut neque non et debitis',
    icon: 'bi-calendar-week'
  }
];

const defaultTestimonials = [
  {
    id: 1,
    name: 'Matt Brandon',
    job: 'Freelancer',
    content: 'Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.',
    image: './pics/T1.jpg'
  },
  {
    id: 2,
    name: 'John Larson',
    job: 'Entrepreneur',
    content: 'Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.',
    image: './pics/T2.jpg'
  },
  {
    id: 3,
    name: 'Saul Goodman',
    job: 'CEO & Founder',
    content: 'Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.',
    image: './pics/T3.jpg'
  },
  {
    id: 4,
    name: 'Sara Wilsson',
    job: 'Designer',
    content: 'Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.',
    image: './pics/Te2.png'
  },
  {
    id: 5,
    name: 'Jena Karlis',
    job: 'Store Owner',
    content: 'Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.',
    image: './pics/Te3.png'
  }
];

function loadFromStorage(storageKey, fallbackData) {
  const storedValue = localStorage.getItem(storageKey);
  if (storedValue) {
    return JSON.parse(storedValue);
  }
  localStorage.setItem(storageKey, JSON.stringify(fallbackData));
  return fallbackData;
}

function saveToStorage(storageKey, dataArray) {
  localStorage.setItem(storageKey, JSON.stringify(dataArray));
  refreshLandingPageContent();
}

function generateNewId(dataArray) {
  const maxId = dataArray.reduce((max, item) => Math.max(max, item.id || 0), 0);
  return maxId + 1;
}

function shortenText(text, maxLength = 50) {
  if (typeof text !== 'string' || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

class ContentManager {
  constructor(config) {
    this.storageKey = config.key;
    this.defaultData = config.initialData;
    this.formElementId = config.formId;
    this.tableElementId = config.tableId;
    this.getFormValues = config.getFormData;
    this.populateForm = config.fillForm;
    this.generateRowHTML = config.renderRowHTML;
    this.currentEditId = null;
    this.formElement = document.getElementById(this.formElementId);
    this.tableBodyElement = document.getElementById(this.tableElementId);

    if (this.formElement && this.tableBodyElement) {
      this.submitButton = this.formElement.querySelector('button[type="submit"]');
      this.initialize();
    }
  }

  initialize() {
    this.displayData();
    this.formElement.addEventListener('submit', (event) => this.onFormSubmit(event));
  }

  fetchData() {
    return loadFromStorage(this.storageKey, this.defaultData);
  }

  displayData() {
    const dataArray = this.fetchData();
    this.tableBodyElement.innerHTML = '';

    if (dataArray.length === 0) {
      this.tableBodyElement.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No data defined.</td></tr>';
      return;
    }

    dataArray.forEach((item, index) => {
      const row = this.tableBodyElement.insertRow();
      row.className = 'align-middle';
      row.innerHTML = this.generateRowHTML(item, index);
    });
  }

  onFormSubmit(event) {
    event.preventDefault();

    const formData = this.getFormValues();
    if (!formData.title && !formData.name) {
      alert('Please fill in required fields.');
      return;
    }

    let dataArray = this.fetchData();

    if (this.currentEditId !== null) {
      dataArray = dataArray.map(item =>
        item.id === this.currentEditId ? { id: item.id, ...formData } : item
      );
      this.currentEditId = null;
      this.submitButton.textContent = 'Submit';
    } else {
      const newId = generateNewId(dataArray);
      dataArray.push({ id: newId, ...formData });
    }

    saveToStorage(this.storageKey, dataArray);
    this.formElement.reset();
    this.displayData();
    alert('Data saved successfully!');
  }

  editItem(itemId) {
    const dataArray = this.fetchData();
    const item = dataArray.find(element => element.id === itemId);

    if (item) {
      this.populateForm(item);
      this.currentEditId = itemId;
      this.submitButton.textContent = 'Update Item';
      this.formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  removeItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
      let dataArray = this.fetchData();
      dataArray = dataArray.filter(item => item.id !== itemId);
      saveToStorage(this.storageKey, dataArray);
      this.displayData();
    }
  }
}

const servicesController = new ContentManager({
  key: DB_KEYS.SERVICES_DATA,
  initialData: defaultServices,
  formId: 'serviceForm',
  tableId: 'servicesTableBody',
  getFormData: () => ({
    title: document.getElementById('serviceTitle').value.trim(),
    content: document.getElementById('serviceContent').value.trim(),
    icon: document.getElementById('serviceIcon').value.trim()
  }),
  fillForm: (item) => {
    document.getElementById('serviceTitle').value = item.title;
    document.getElementById('serviceContent').value = item.content;
    document.getElementById('serviceIcon').value = item.icon || '';
  },
  renderRowHTML: (item, index) => `
    <td>${index + 1}</td>
    <td class="text-success fs-4 text-center">
      <i class="${item.icon || 'bi-question-circle'}"></i>
    </td>
    <td>${item.title}</td>
    <td>${shortenText(item.content, 50)}</td>
    <td>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-warning" onclick="editService(${item.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteService(${item.id})">Delete</button>
      </div>
    </td>
  `
});

window.editService = (id) => servicesController.editItem(id);
window.deleteService = (id) => servicesController.removeItem(id);

const testimonialsController = new ContentManager({
  key: DB_KEYS.TESTIMONIALS_DATA,
  initialData: defaultTestimonials,
  formId: 'testimonialForm',
  tableId: 'testimonialsTableBody',
  getFormData: () => {
    const imageInput = document.getElementById('testimonialImage');
    return {
      name: document.getElementById('testimonialName').value.trim(),
      job: document.getElementById('testimonialJob').value.trim(),
      content: document.getElementById('testimonialContent').value.trim(),
      image: imageInput ? imageInput.value.trim() : ''
    };
  },
  fillForm: (item) => {
    document.getElementById('testimonialName').value = item.name;
    document.getElementById('testimonialJob').value = item.job;
    document.getElementById('testimonialContent').value = item.content;
    const imageInput = document.getElementById('testimonialImage');
    if (imageInput) imageInput.value = item.image || '';
  },
  renderRowHTML: (item, index) => {
    const nameParts = item.name.trim().split(/\s+/);
    let firstName = nameParts[0] || '';
    let lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const avatarHTML = item.image
      ? `<img src="${item.image}" class="rounded-circle me-2" style="width: 30px; height: 30px; object-fit: cover;">`
      : '';

    return `
      <td>${index + 1}</td>
      <td>${avatarHTML} ${firstName}</td>
      <td>${lastName}</td>
      <td>${item.job}</td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-warning" onclick="editTestimonial(${item.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTestimonial(${item.id})">Delete</button>
        </div>
      </td>
    `;
  }
});

window.editTestimonial = (id) => testimonialsController.editItem(id);
window.deleteTestimonial = (id) => testimonialsController.removeItem(id);

function refreshLandingPageContent() {
  const servicesContainer = document.getElementById('landing-services-list');
  if (servicesContainer) {
    const servicesData = loadFromStorage(DB_KEYS.SERVICES_DATA, defaultServices);
    servicesContainer.innerHTML = servicesData.map(service => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="service-box p-4 bg-white text-center shadow-sm h-100">
          <i class="${service.icon || 'bi-briefcase'} text-success fs-2 mb-3 d-block"></i>
          <h3 class="fs-4 fw-bold">${service.title}</h3>
          <p class="text-muted">${service.content}</p>
        </div>
      </div>
    `).join('');
  }

  const testimonialsContainer = document.getElementById('landing-testimonials-list');
  if (testimonialsContainer) {
    testimonialsContainer.className = 'container';
    const testimonialsData = loadFromStorage(DB_KEYS.TESTIMONIALS_DATA, defaultTestimonials);

    if (testimonialsData.length === 0) {
      testimonialsContainer.innerHTML = '<p class="text-center text-muted">No testimonials yet.</p>';
      return;
    }

    const totalSlides = Math.ceil(testimonialsData.length / 3);
    let indicators = '';
    for (let i = 0; i < totalSlides; i++) {
      indicators += `
        <button type="button" 
                data-bs-target="#testimonialCarousel" 
                data-bs-slide-to="${i}" 
                class="${i === 0 ? 'active' : ''}" 
                aria-current="${i === 0 ? 'true' : 'false'}" 
                aria-label="Slide ${i + 1}"></button>`;
    }

    let slides = '';
    for (let i = 0; i < testimonialsData.length; i += 3) {
      const group = testimonialsData.slice(i, i + 3);
      const isActive = i === 0 ? ' active' : '';
      const items = group.map(testimonial => `
        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
          <div class="d-flex flex-column h-100 w-100">
            <div class="p-4 rounded position-relative flex-grow-1" style="background-color: #f1f3f5;">
              <i class="bi bi-quote fs-2 text-dark opacity-75 mb-1 d-block"></i>
              <p class="fst-italic mb-0 text-secondary" style="font-size: 0.95rem; line-height: 1.6;">
                ${testimonial.content}
                <i class="bi bi-quote fs-5 text-dark opacity-50 ms-1"></i>
              </p>
            </div>
            <div class="text-start ps-4" style="margin-top: -40px; position: relative; z-index: 2;">
              <img src="${testimonial.image || 'https://via.placeholder.com/150'}" 
                   alt="${testimonial.name}" 
                   class="rounded-circle mb-2 shadow-sm" 
                   style="width: 80px; height: 80px; object-fit: cover; border: 5px solid #fff;"> 
              <h5 class="fw-bold mb-0 text-dark" style="font-size: 1.1rem;">${testimonial.name}</h5>
              <span class="text-muted small text-uppercase">${testimonial.job}</span>
            </div>
          </div>
        </div>
      `).join('');

      slides += `
        <div class="carousel-item${isActive}">
          <div class="row justify-content-center g-4 pb-4">
            ${items}
          </div>
        </div>
      `;
    }

    testimonialsContainer.innerHTML = `
      <style>
        .custom-indicators {
          bottom: -60px !important;
          margin-bottom: 0 !important;
        }
        .custom-indicators button {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          border: 2px solid #28a745 !important;
          background-color: transparent !important;
          opacity: 1 !important;
          margin: 0 6px !important;
          transition: all 0.3s ease;
        }
        .custom-indicators button.active {
          background-color: #28a745 !important;
        }
      </style>

      <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner" style="padding-bottom: 30px;">
          ${slides}
        </div>
        
        <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev" style="width: 5%; margin-left: -5%; opacity: 0;">
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next" style="width: 5%; margin-right: -5%; opacity: 0;">
          <span class="visually-hidden">Next</span>
        </button>
        
        <div class="carousel-indicators custom-indicators">
          ${indicators}
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  refreshLandingPageContent();
  console.log('System Loaded.');
});

window.addEventListener('storage', (event) => {
  if (event.key === DB_KEYS.SERVICES_DATA || event.key === DB_KEYS.TESTIMONIALS_DATA) {
    console.log('Detected change. Syncing...');
    refreshLandingPageContent();
  }
});