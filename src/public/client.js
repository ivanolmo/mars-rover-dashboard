const store = Immutable.Map({
    user: { name: "Student" },
    rovers: ['Curiosity', 'Opportunity', 'Spirit', 'Perseverance'],
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root) => {
    root.innerHTML = App()
}

// create content
const App = () => {
    return `
    <div class="navbar">
        <div class="container flex">
            <h1 class="logo">Mars Rover Dashboard</h1>
            <nav>
                <ul>
                    <li><a href="#" onclick="roverSelection('spirit', updateUI)">Spirit</a></li>
                    <li><a href="#" onclick="roverSelection('opportunity', updateUI)">Opportunity</a></li>
                    <li><a href="#" onclick="roverSelection('curiosity', updateUI)">Curiosity</a></li>
                    <li><a href="#" onclick="roverSelection('perseverance', updateUI)">Perseverance</a></li>
                </ul>
            </nav>
        </div>
    </div>
    <div class="info-card">
        <ul class="row">
            <li class="rover-item">Rover Name: <span id="rover-name"></span></li>
            <li class="rover-item">Launch Date: <span id="rover-launch-date"></span></li>
        </ul>
        <ul class="row">
            <li class="rover-item">Landing Date: <span id="rover-landing-date"></span></li>
            <li class="rover-item">Current Mission Status: <span id="rover-status"></span></li>
        </ul>
        <ul class="row">
            <li class="rover-item">Date Of Latest Photos: <span id="rover-latest-photos"></span></li>
            <li class="rover-item">Total Rover Photos Available: <span id="rover-total-photos"></span></li>
        </ul>
    </div>
    <section class="gallery">
        <div class="container grid" id="image-gallery">
        </div>
    </section>
    `
}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
});


// ------------------------------------------------------  COMPONENTS
// ------------------------------------------------------  API CALLS
// pure functions
async function getRoverPhotos(rover) {
    try {
        const res = await fetch('http://localhost:3000/getRoverPhotos', {
            headers: {
                'rover': rover,
            }
        });
        let roverImages = await res.json();
        return roverImages;
    } catch(err) {
        console.log(`getRoverPhotos error is ${err}`)
    }
};

async function getRoverData(rover) {
    try {
        const res = await fetch('http://localhost:3000/getRoverData', {
            headers: {
                'rover': rover,
            }
        });
        let roverData = await res.json();
        return roverData;
    } catch(err) {
        console.log(`getRoverData error is ${err}`)
    }
};


// higher order function to process rover click, then update UI through callback
async function roverSelection(rover, callBack) {
    // clear UI between requests
    document.getElementById('image-gallery').innerHTML = '';

    let data = await getRoverData(rover);
    let photos = await getRoverPhotos(rover);

    callBack(data, photos);
};


// higher order function that returns IIFE. updates UI after clicking on desired rover
async function updateUI(data, photos) {
    let roverName, roverLaunch, roverLanding, roverStatus, roverLatestPhotosDate, roverTotalPhotos;
    roverName = data.roverData.photo_manifest.name;
    roverLaunch = data.roverData.photo_manifest.launch_date;
    roverLanding = data.roverData.photo_manifest.landing_date;
    roverStatus = data.roverData.photo_manifest.status;
    roverLatestPhotosDate = data.roverData.photo_manifest.max_date;
    roverTotalPhotos = data.roverData.photo_manifest.total_photos;
    
    document.getElementById('rover-name').innerHTML = roverName;
    document.getElementById('rover-launch-date').innerHTML = roverLaunch;
    document.getElementById('rover-landing-date').innerHTML = roverLanding;
    document.getElementById('rover-status').innerHTML = roverStatus;
    document.getElementById('rover-latest-photos').innerHTML = roverLatestPhotosDate;
    document.getElementById('rover-total-photos').innerHTML = roverTotalPhotos;

    return (function() {photos.roverImages.photos.map(photo => {
        let imageElement = document.createElement('img');
        imageElement.className = 'grid-item';
        imageElement.setAttribute('src', photo.img_src);
        
        document.getElementById('image-gallery').appendChild(imageElement);
    })})();
};
