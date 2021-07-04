ARGS = "100,200 700,900"

.PHONY : process
process:
	g++ -c -std=c++11 lib/jsoncpp.cpp 
	g++ -c -std=c++11 processes.cpp
	g++ -std=c++11 main.cpp -o main 
	./main
