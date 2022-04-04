// require our dependencies

const mongoose = require('mongoose')
const Place = require('./place')

const db = require('../../config/db')

const starterPlaces = [
    {
    name: "Amityville House",
    location: "Long Island, NY",
    image: "https://i.imgur.com/NixYZuF.jpg",
    description: "The site of the famous Amityville Horror as accounted by George and Kathy Lutz, said to be haunted by evil spirits.",
    scareLevel: 8,
    },
    {
    name: "Bobby Mackey's Music World",
    location: "Wilder, KY",
    image: "https://i.imgur.com/OKIWTy1.jpg",
    description: "A former slaughter house turned nightclub and honky-tonk now said to be the most haunted night club in America and a gateway to hell",
    scareLevel: 7,
    },
    {
    name: "Bellaire House",
    location: "Bellaire, OH",
    image: "https://i.imgur.com/i3DiK6e.png",
    description: "In 1947, a woman named Lyde Heatherington died in the house, causing her brother Edwin to contact a medium. When doing a seance and attempting to contact his sister, it is said that spiritual portals where opened, causing several spirits into the home, including one that disguises herself as a small girl named Emily.",
    scareLevel: 6,
    },
    {
    name: "Big Gnarly Ted's Haunted Mansion",
    location: "Gainesville, FL",
    image: "https://i.imgur.com/eJSNTqb.jpg",
    description: "Ted was a former student at General Assembly. As a Software Engineer, he thought it would be a good idea to make an app to visit haunted locales. Little did he know that the day he went to this mansion would be his last.",
    scareLevel: 10,
    },
    {
    name: "Bonaventure Cemetery",
    location: "Savannah, GA",
    image: "https://i.imgur.com/HeWRIZm.jpg",
    description: "Many notable figures are buried here, the most famous being a 6 year old girl named Gracie. Many visitors place toys at her grave when they visit and some report seeing her ghost near the site. People have also reported inexplicable sounds such as crying babies and barking dogs, as well as statues suddenly smiling as people approach them.",
    scareLevel: 4,
    },
    {
    name: "Dauphine Orleans Hotel",
    location: "New Orleans, LA",
    image: "https://i.imgur.com/bytDDPv.png",
    description: "Many ghosts haunt this hotel and its bar, May Bailey's Place. Some include Mille, who walks the halls in her wedding gown and Jewel, a teen who who is described as dancing along without touching the ground and often helping guests who arrive late to their room at night.",
    scareLevel: 7,
    },
    {
    name: "Eastern State Penitentiary",
    location: "Philadelphia, PA",
    image: "https://i.imgur.com/3v4rNZI.jpg",
    description: "A haunted prison known for numerous atrocities. The hauntings include echoing voices, cackling, shadowy figures darting along the walls and visions of ghostly faces.",
    scareLevel: 5,
    },
    {
    name: "Goatman's Bridge",
    location: "Lantana, TX",
    image: "https://i.imgur.com/gRqm1gc.jpg",
    description: "A bridge said to be haunted by a half-man half-goat figure called Goatman. It is said if you cross the bridge at night without headlights you will be met on the other side by the Goatman.",
    scareLevel: 5,
    },
    {
    name: "The Headless Horseman Bridge",
    location: "Sleepy Hollow, NY",
    image: "https://i.imgur.com/d9szvq0.png",
    description: "The bridge in the The Legend of Sleep Hollow that Ichabod Crane leads the Headless Horseman to on a horseback chase through the woods in the dark of night.",
    scareLevel: 5,
    },
    {
    name: "The House of Seven Gables",
    location: "Salem, MA",
    image: "https://i.imgur.com/1maQER5.jpg",
    description: "Once home to Nathaniel Hawthorne there was said to be a curse on the family. His father, John, served as a judge during the Salem Witch Trials, said to be cursed by the witches which he sent to their deaths.",
    scareLevel: 5,
    },
    {
    name: "Huguenot Cemetery",
    location: "St. Augustine, FL",
    image: "https://i.imgur.com/nJronIZ.jpg",
    description: "Gravestones that date back two centuries with spirits such as a 14 year old girl floating among the trees and Judge John Stickley, a judge that passed away in 1882 but is said to be seen in the cemetery to this day.",
    scareLevel: 7,
    },
    {
    name: "LaLaurie Mansion",
    location: "New Orleans, LA",
    image: "https://i.imgur.com/BR95DKa.png",
    description: "Named after Madame Delphine LaLaurie, it said she killed the workers who lived in the mansion, where the ghosts of her victims remain.",
    scareLevel: 6,
    },
    {
    name: "Lizzie Borden House",
    location: "Fall River, MA",
    image: "https://i.imgur.com/WfSkpdH.png",
    description: "The home of Lizzie Borden and her family and the site of the famous unsolved double murder of her father and stepmother Andrew and Abby Borden.",
    scareLevel: 6,
    },
    {
    name: "Moon River Brewing Company",
    location: "Savannah, GA",
    image: "https://i.imgur.com/GiS0UT5.jpg",
    description: "This place is haunted by people who died during the yellow fever outbreak of 1897 while the building was used as a makeshift hospital. One such spirit is the Lady in White, a woman dressed in white who resides on the upper floors.",
    scareLevel: 5,
    },
    {
    name: "Pine Barrens",
    location: "Pine Barrens, NJ",
    image: "https://i.imgur.com/qoQa9Wd.png",
    description: "A forest said to be haunted by notable figures such as the Jersey Devil, a cursed child born in 1735 to a local woman known as Mrs. Leeds. The Devil is said to roam the Barrens, with many sharing stories of encounters with the Devil during dark nights.",
    scareLevel: 8,
    },
    {
    name: "Point Pleasant",
    location: "Point Pleasant, WV",
    image: "https://i.imgur.com/P1rxyWG.jpg",
    description: "The location of Mothman, said to be seen in the area as a large winged creature with glowing red eyes. He is said be seen near the old WW2 bunkers that are in the area.",
    scareLevel: 7,
    },
    {
    name: "Proctor's Ledge",
    location: "Salem, MA",
    image: "https://i.imgur.com/ILsYWpu.png",
    description: "The site during the Salem Witch Trials where the hangings took place. It is said many innocent people died here and it is still haunted to this day.",
    scareLevel: 8,
    },
    {
    name: "Pythian Castle",
    location: "Springfield, MI",
    image: "https://i.imgur.com/ZmtrVqa.jpg",
    description: "Housing prisoners of WW2 from Germany and Italy for labor and medical treatment, it is said many died here leading to paranormal activity.",
    scareLevel: 5,
    },
    {
    name: "Sallie House",
    location: "Atchison, KS",
    image: "https://i.imgur.com/gnLNuM8.jpg",
    description: "A house that became the residence of a Atchison physician. He is said to have attempted operate on a 6 year old girl, named Sallie, who died on the operating table. From that day she is said to have haunted the house.",
    scareLevel: 7,
    },
    {
    name: "Schoenborn Family Estate",
    location: "Gainesville, FL",
    image: "https://i.imgur.com/IClNjPz.png",
    description: "As reported by Timm Schoenborn and home to his grandma, he noticed strange things within this house. After being there for a two week stay, he soon realized his grandma's house was haunted, with strange occurrences still happening daily.",
    scareLevel: 10,
    },
    {
    name: "St. Augustine Lighthouse",
    location: "St. Augustine, FL",
    image: "https://i.imgur.com/nfSqMOp.jpg",
    description: "A lighthouse believed to still be haunted by its keepers and other ghosts such as Peter Rasmussen and Joseph Andreu. The most famous ghosts are those of Eliza and Mary Pity, who died while playing with a cart that tumbled into the ocean, who still play to this day.",
    scareLevel: 6,
    },
    {
    name: "Villisca Axe Murder House",
    location: "St. Augustine, FL",
    image: "https://i.imgur.com/KSScKQO.jpg",
    description: "A house of the famous axe murders that occurred in 1912 where six members of the Moore family and two guests were killed, now said to be haunted.",
    scareLevel: 5,
    },
    {
    name: "Vulture Mine",
    location: "Wickenburg, AZ",
    image: "https://i.imgur.com/8zFOzX6.jpg",
    description: "An abandoned ghost town which was once the site of a mining operation. Over 18 men where killed here for stealing gold ore, and it is said to be haunted by their spirits who still roam the mines.",
    scareLevel: 6,
    },
    {
    name: "Warren's Occult Museum",
    location: "Monroe, CT",
    image: "https://i.imgur.com/5xBhRmE.png",
    description: "Open since 1952, Ed and Lorraine Warren house this ever-expanding collection of knick-knacks and artifacts that have been touched by evil, such as the famous Annabelle doll.",
    scareLevel: 7,
    },
    {
    name: "Waverly Hills Hospital",
    location: "Louisville, KY",
    image: "https://i.imgur.com/Xsedy3d.jpg",
    description: "A hospital where nearly 50,000 people died to the tuberculosis outbreak, it is said to be extremely haunted. One of the most notable ghosts is a boy named Timmy, who is said to return a ball if it is rolled down to him.",
    scareLevel: 5,
    },
    {
    name: "Whaley House",
    location: "San Diego, CA",
    image: "https://i.imgur.com/rC5StdQ.jpg",
    description: "Built on the site where the famous thief Jim Robinson was publicly executed, it is said it was a prone to paranormal activity since it was built. This continued to grow as the Whaley family lived there, the family struck with numerous tragic deaths, as well as paranormal and spiritual encounters that continue today.",
    scareLevel: 6,
    },
    {
    name: "Winchester Mystery House",
    location: "San Jose, CA",
    image: "https://i.imgur.com/WmfbD0l.jpg",
    description: "Mystery is a well-earned middle name for this San Jose Victorian mansion built by owner Sarah Pardee Winchester to, allegedly, appease spirits— specifically those who had fallen to the famous Winchester rifle.",
    scareLevel: 8,
    },
]

// first we connect to the db via mongoose
mongoose.connect(db, {
	useNewUrlParser: true,
})
    .then(() => {
        // then we remove all the places
        Place.deleteMany({ owner: null })
            .then(deletedPlaces => {
                console.log('deleted places', deletedPlaces)
                // then we create using the startPets array
                // we'll use console logs to check if it's working or if there are errors
                Place.create(starterPlaces)
                    .then(newPlaces => {
                        console.log('the new places', newPlaces)
                        mongoose.connection.close()
                    })
                    .catch(err => {
                        console.log(err)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    // then at the end, we close our connection to the db
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })