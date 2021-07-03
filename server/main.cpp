#include<iostream>
#include<fstream>
#include<sstream>
#include <vector>
#include <array>
#include <map>
#include <thread>
#include <math.h>

#include "lib/jsoncpp.cpp"
#include "processes.cpp"

enum distanc_unit {cm, mm, nm, um};
enum force_unit {mN, N, uN};

using namespace std;

struct Grid{
    Plane plane{{}};
    distanc_unit unit = um;
} grid;

Vector_field traction_field;
Vector_field displacement_field;

vector <Curve> contour;
string processed_data = "";

void show_point(Point p){
    cout << "( "<<p[0]<<", "<<p[1]<<")";
}

void generate_countours(Curve c){
    // thread thread_object(callable);
    contour.clear();
    Curve old_curve = c;
    float unit = 100;

    for (int i = 0; i < 2; i++){
        Curve new_curve;
        for ( int j = 0; j < old_curve.size(); j++){
            float delx = 0;
            float dely = 0;

            Point point = old_curve[j];
            if (j == old_curve.size()-1){
                delx = old_curve[0][0] - old_curve[j-1][0];
                dely = old_curve[0][1] - old_curve[j-1][1]; 
            }
            else if (j == 0){
                delx = old_curve[j+1][0] - old_curve[old_curve.size()-1][0];
                dely = old_curve[j+1][1] - old_curve[old_curve.size()-1][1];
            }
            else{
                delx = old_curve[j+1][0] - old_curve[j-1][0];
                dely = old_curve[j+1][1] - old_curve[j-1][1]; 
            }

            float costheta = -dely/(sqrt(pow(delx,2) + pow(dely,2)));
            float sintheta = delx/(sqrt(pow(delx,2) + pow(dely,2)));

            Point new_point = {point[0]+ unit*costheta, point[1]+unit*sintheta};
            new_curve.push_back(new_point);
        }
        contour.push_back(new_curve);
        old_curve.clear();
        old_curve = new_curve;
        new_curve.clear();
    }
}

void generate_rectangular_grids(int m, int n, float max_x, float max_y, distanc_unit unit = um, float min_x = 0, float min_y = 0){
    float dx = (max_x - min_x)/m;
    float dy = (max_y - min_y)/n;
    grid.unit = unit;
    for (int i = 0; i <= m ; i++){
        grid.plane.push_back({});
        for (int j = 0; j <= n; j++){
            Point p = {min_x + i * dx, min_y + j * dy};
            grid.plane[i].push_back(p);
        }
    }
}

void show_grids(){
    auto m = grid.plane.size() -1 ;
    auto n = grid.plane[0].size();

    for (int i = 0; i < m ; i++){
        for (int j = 0; j < n; j++){
            show_point(grid.plane[i][j]);
            cout <<" ";
        }
        cout <<"\n";
    }
    cout<< " \nder size ist "<<m - 1<<", "<<n - 1<<" \n";
}

void init_traction(Curve list_of_points, vector <Stress> list_of_tractions){
    int total_points = list_of_points.size();
    for (int i = 0; i < total_points; i++){
        traction_field.insert(pair<Point, Force>(list_of_points[i], list_of_tractions[i]));
    }
}

void init_diplacement(Curve list_of_points, vector <Displacement> list_of_displacements){
    int total_points = list_of_points.size();
    for (int i = 0; i < total_points; i++){
        displacement_field.insert(pair<Point, Force>(list_of_points[i], list_of_displacements[i]));
    }
}

void process_data(){
    Json::Value process_request;
    ifstream process_request_file("input_data.json", std::ifstream::binary);
    process_request_file >> process_request;

    string functname = process_request["functname"].asString();
        
    if (functname == "contourmesh"){
        draw_contour(process_request);
    }
    // else if (functname == "apply_traction"){
    //     apply_traction(process_request);
    // }
    
}

int main(){
    process_data();
        
    // generate_countours(c);
    // generate_rectangular_grids(10, 10, 100, 100);
    // // show_grid();
    // Curve c = {{40, 40}, {42, 38}, {44, 38}};
    // vector <Stress> S = {{1, 1, 0}, {-1, 1, 0}, {-1, -1, 0}};
    // init_traction(c, S);
}

