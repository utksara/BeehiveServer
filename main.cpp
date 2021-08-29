
#include<iostream>
#include<fstream>
#include<sstream>
#include "processes.h"
#ifndef LIB_JSONCPP_JSON_TOOL_H_INCLUDED
    #include "cpp_modules/dist/json/json.h"
#endif
enum distanc_unit {cm, mm, nm, um};
enum force_unit {mN, N, uN};

using namespace std;

void process_data(){
    Json::Value process_request;
    ifstream process_request_file("inputoutput/input_data.json", std::ifstream::binary);
    process_request_file >> process_request;

    string functname = process_request["functname"].asString();
        
    if (functname == "contourmesh"){
        draw_contour(process_request);
    }
    if (functname == "traction"){
        update_displacement_field(process_request);
    }   
}

int main(int argc, char** argv){
    if (argc <=1){
        process_data();
    }
    else{
        map<string, string> data; 
        string func = argv[1];
        for (int i = 2; i+1 < argc; i+=2){
            data.insert(pair<string, string>(argv[i], argv[i+1]));
        }
        if (func.compare("line") == 0){
            draw_line(data);
        }
        // else if (func == "curve"){
        //     cout << "\nhellow ";
        //     draw_line(data);
        // }
    }
}