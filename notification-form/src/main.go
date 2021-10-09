package main

import(
	"github.com/gorilla/mux"
	"net/http"
	"os"
	"log"  
)

type supervisor struct {
	Id int64 `json:id`
	Phone string `json:phone`
	IdentificationNumber string `json:indentificationNumber`
	Jurisdiction string `json:"jurisdiction"`
	LastName string `json:"lastName"`
	FirstName string `json:"firstName"`
}

func main(){
	r := mux.NewRouter()
	
	r.HandleFunc("/supervisor", supervisor)

	http.Handle("/", r)

	srv := &http.Server{
		Handler: r,
		Addr: ":" + os.Getenv("PORT"),
	}

	log.Fatal(srv.LIstenAndServe())
	//router.Get("/supervisors", https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers"
}

func supervisor(w http.ResponseWriter, r *http.Request){
	response, err := http.get("https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers")

	if err != nil {
		fmt.Print(err.Error())
		os.Exit(1)
	}

	responseData, err := ioutil.ReadAll(response.Body)
	
	if err != nil{
		log.Fatal(err)
	}

	fmt.Println(string(responseData))
}

