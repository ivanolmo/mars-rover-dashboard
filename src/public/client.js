console.log('client.js loaded')

let store = {
    // user: { name: "Student" },
    // apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
    <div class="navbar">
        <div class="container flex">
            <h1 class="logo">Mars Rover Dashboard</h1>
            <nav>
                <ul>
                    <li><a href="#" onclick="getRoverPhotos('curiosity')">Curiosity</a></li>
                    <li><a href="#" onclick="getRoverPhotos('opportunity')">Opportunity</a></li>
                    <li><a href="#" onclick="getRoverPhotos('spirit')">Spirit</a></li>
                    <li><a href="#" onclick="getRoverPhotos('perseverance')">Perseverance</a></li>
                </ul>
            </nav>
        </div>
    </div>
    <div class="info-card">
        <ul>
            <li>Rover Name: </li>
            <li>Launch Date: </li>
            <li>Landing Date: </li>
            <li>Current Mission Status: </li>
            <li>Date Of Latest Photos: </li>
            <li>Total Rover Photos Available: </li>
        </ul>
    </div>
    <section class="gallery">
        <div class="container grid">
            
        </div>
    </section>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Function to create info card
const cardInfoData = (roverData) => {

}

// Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = (apod) => {

//     // If image does not already exist, or it is not from today -- request it again
//     const today = new Date()
//     const photodate = new Date(apod.date)
//     console.log(photodate.getDate(), today.getDate());

//     console.log(photodate.getDate() === today.getDate());
//     if (!apod || apod.date === today.getDate() ) {
//         getImageOfTheDay(store)
//     }

//     // check if the photo of the day is actually type video!
//     if (apod.media_type === "video") {
//         return (`
//             <p>See today's featured video <a href="${apod.url}">here</a></p>
//             <p>${apod.title}</p>
//             <p>${apod.explanation}</p>
//         `)
//     } else {
//         return (`
//             <img src="${apod.image.url}" height="350px" width="100%" />
//             <p>${apod.image.explanation}</p>
//         `)
//     }
// }

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => {
            console.log(res);
            res.json();
        })
        .then(apod => updateStore(store, { apod }))

    return data
}

async function getRoverPhotos(rover) {
    try {
        const res = await fetch('http://localhost:3000/getRoverPhotos', {
            headers: {
                'rover': rover,
            }
        });
        let roverImages = await res.json();
        console.log(roverImages.roverImages.photos)
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
        console.log(roverData.roverData.photo_manifest)
        return roverData;
    } catch(err) {
        console.log(`getRoverData error is ${err}`)
    }
};
