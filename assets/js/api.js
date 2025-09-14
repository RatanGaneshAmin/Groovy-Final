const APILINK='https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=db4f1516ecde4feea101c2b87f919cd7&page=1';
const IMGPATH='https://image.tmdb.org/t/p/w1280';
const SEARCHAPI="https://api.themoviedb.org/3/search/movie?&api_key=db4f1516ecde4feea101c2b87f919cd7&query=";

const main=document.getElementById("section");
const form=document.getElementById("form");
const searche=document.getElementById("search");

returnMovies(APILINK)
function returnMovies(url){
    fetch(url).then(res=>res.json())
    .then(function(data){
        console.log(data.results);
        data.results.forEach(element => {
            const div_card = document.createElement('div');
            div_card.setAttribute('class','card');
            const div_row = document.createElement('div');
            div_row.setAttribute('class','row');
            const div_column = document.createElement('div');
            div_column.setAttribute('class','column');
            const image = document.createElement('img');
            image.setAttribute('class','thumbnail');
            image.setAttribute('id','image');
            const title = document.createElement('h3');
            title.setAttribute('id','title');
            const vote_average = document.createElement('h3');
            vote_average.setAttribute('id','vote_average');
            const center = document.createElement('center');

            title.innerHTML = `${element.title}`;
            vote_average.innerHTML = `${element.vote_average}`;
            image.src= IMGPATH + element.poster_path;

            center.appendChild(image);
            div_card.appendChild(center);
            div_card.appendChild(title);
            div_card.appendChild(vote_average);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);
            main.appendChild(div_row);
        });
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML=''

    const searchItem =searche.value;

    if (searchItem){
        returnMovies(SEARCHAPI+searchItem);
        searche.value="";
    }
});