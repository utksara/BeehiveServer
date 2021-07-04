#include<iostream>
#include<fstream>
#include<sstream>
#include <vector>
#include <array>
#include <map>
#include <thread>
#include <math.h>
#include "lib/json/json.h"

#define Point array<float, 2>
#define Force array<float, 3>
#define Stress array<float, 3>
#define Displacement array<float, 3>
#define Curve vector <Point>
#define Vector_field map <Point, Stress>
#define Plane vector < vector <Point>>

using namespace std;
typedef Json::Value json;

Point read_int(string word){
    stringstream read_word(word);
    Point p;
    int n, i = 0;
    while (read_word.good()) {
        string substr;
        getline(read_word, substr, ',');
        stringstream s(substr);
        s >> n;
        p[i] = n;
        i++; 
    }
    return p;
}

void draw_contour(json process_request, int base_radius = 50){

    string values = process_request["values"].asString(); 
    stringstream readd(values);
    string word;
    while(readd >> word){
        Point p = read_int(word);
        int N = 50;
        string coords;   
        for (int F = 3; F <= 10; F ++){
            coords.append("M");
            for (int k = 0 ; k < F * N; k ++ ){
                float theta = k * 2*3.14/(F * N);
                float x = F * base_radius * cos(theta) + p[0];
                float y = F * base_radius * sin(theta) + p[1];
                coords.append(to_string(x));
                coords.append(",");
                coords.append(to_string(y));
                coords.append(" ");        
            }
            coords.append("Z");
        } 

        string output_data = "{\"data\" : \"";
        output_data.append(coords);
        output_data.append("\"}");
        ofstream output_file("output_data.json", std::ifstream::binary);
        output_file << output_data;
        output_file.close();
    }
}

// void apply_traction(json process_request){

//     string _boundary = process_request["values"]["boundary"].asString();
//     string _traction = process_request["values"]["traction"].asString(); 
//     string _contours = process_request["values"]["contours"].asString(); 

//     Curve boundary;
//     Curve traction;
//     vector <Curve> modified_contours;

//     stringstream readd(_boundary);
//     string word;
//     while(readd >> word){
//         boundary.push_back(read_int(word));
//     }

//     stringstream readd(_traction);
//     while(readd >> word){
//         traction.push_back(read_int(word));
//     }

//     stringstream readd(_contours);
//     Curve contour;
//     while(readd >> word){
//         if (word == "\n"){  
//             modified_contours.push_back(contour);
//             contour.clear();
//         }
//         else{
//             contour.push_back(read_int(word));
//         }
//     }
// }
