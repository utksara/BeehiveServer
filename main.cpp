
#include<iostream>
#include<fstream>
#include<sstream>

#include "dist/json/json.h"
#include "processes.h"

enum distanc_unit {cm, mm, nm, um};
enum force_unit {mN, N, uN};

using namespace std;

void process_data(){
    Json::Value process_request;
    ifstream process_request_file("input_data.json", std::ifstream::binary);
    process_request_file >> process_request;

    string functname = process_request["functname"].asString();
        
    if (functname == "contourmesh"){
        draw_contour(process_request);
    }
    if (functname == "traction"){
        update_displacement_field(process_request);
    }   
}

int main(){
    process_data();
}