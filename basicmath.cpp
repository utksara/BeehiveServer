#include<iostream>
#include<fstream>
#include<sstream>
#include<string>
#include<math.h>
using namespace std;

ofstream myfile;

template <class T>
void post_and_show(T value){
    ostringstream str1;
    str1 << value;
    string data = str1.str();

    string output_data = "{\"data\" : \"";
    output_data.append(data);
    output_data.append("\"}");

    ofstream output_file("inputoutput/output_data.json", std::ifstream::binary);
    output_file<< output_data;
    output_file.close();

    // myfile.open ("data.txt");
    // myfile << data;
    // myfile.close();
    cout << data;
}

int main(int argc, char** argv){
    int n = 0;
    string operation;
    if (argc > 1){ 
        // n = std::stoi(argv[1]);
        operation = argv[1];
    }

    if (operation == "square"){
        int n = std::stoi(argv[2]);
        int num = n*n;
        post_and_show(num);
    }

    else if (operation == "cube"){
        int n = std::stoi(argv[2]);
        int num = n*n*n;
        post_and_show(num);
    }

    else if (operation == "log10"){
        int n = std::stoi(argv[2]);
        float num = log10(n);
        post_and_show(num);
    }

}