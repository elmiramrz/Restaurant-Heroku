


var restaurantData =[];
var currentRestaurant={};
var page=1;
const perPage=10;
var map = null;


function avg(grades)
{
    var total = 0;
    grades.forEach(element => {
        total += element.score;
});
    var res=total / grades.length;
   return res.toFixed(2);
};





const tableRows = _.template(
    `<% _.forEach(restaurantData, function(restaurants) { %>
        <tr data-id=<%- restaurants._id %>>
            <td><%- restaurants.name %></td>
            <td><%- restaurants.cuisine %></td>
            <td><%- restaurants.address.building+' '+ restaurants.address.street%></td>
            <td><%- avg(restaurants.grades) %></td>
            
        </tr>
    <% }); %>`
);



function loadRestaurantData() {

    fetch(`https://salty-taiga-06312.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
           restaurantData = myJson;
            let rows = tableRows(restaurantData);
            $("#restaurant-table tbody").html(rows);
            $("#current-page").html(page);
        })
    };
    

   function getRestaurantById(id){

        for(let i =0; i < restaurantData.length; i++){
            if(restaurantData[i]._id == id){
                //eturn _.cloneDeep(restaurantData[i]);
                return restaurantData[i]
                //return restaurantData[i].name
            }
   
        }
    
        //return null;
    }

    $(function(){

       loadRestaurantData();
    
        $("#restaurant-table tbody").on("click", "tr", function() {
            currentRestaurant=getRestaurantById($(this).attr("data-id"));
            $('.modal-title').text(currentRestaurant.name);
          //alert(currentRestaurant.address.building+' '+currentRestaurant.address.street);
          
  $('#restaurant-address').text(currentRestaurant.address.building+' '+currentRestaurant.address.street);
           
          $('#restaurant-modal').modal('show');
            
    
        });
    });


    $("#previous-page").on("click", function(e) {
        if (page > 1) {
            page--;
        }
        loadRestaurantData();
    });
    
    // Next page button
    $("#next-page").on("click", function(e) {
        page++;
        loadRestaurantData();
    });


    $('#restaurant-modal').on('shown.bs.modal', function () {
//alert(currentRestaurant.address.coord[1]+','+currentRestaurant.address.coord[0]);
        map = new L.Map('leaflet', {
            center: [currentRestaurant.address.coord[1],currentRestaurant.address.coord[0]],
            zoom: 18,
            layers: [
            new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
            });
            L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
           
          
    });

    $('#restaurant-modal').on('hidden.bs.modal', function () {
        map.remove();
    });



// Document is ready
$(document).ready(
function() {
    
    // Load data into page
    loadRestaurantData();
});

