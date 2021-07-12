#include<iostream>
#include<fstream>
#include<sstream>
#include <array>
#include <map>
#include <thread>
#include <math.h>

#include "dist/json/json.h"
#include "calculations.h"

using namespace std;

#define Vector_field map <Point, Stress>
#define Plane vector < vector <Point>>
#define Quantity array<float, 2>
#define Vector_function map <Vector_field, Vector_field>

typedef Json::Value json;

Point read_int(string word);
void draw_contour(json process_request);
void update_displacement_field(json process_request);