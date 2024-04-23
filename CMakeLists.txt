cmake_minimum_required(VERSION 3.22.1)

#include(FetchContent)

project(the_game_of_life)

set(CMAKE_C_STANDARD 11)

#FetchContent_Declare(
#        SDL2
#        GIT_REPOSITORY "https://github.com/libsdl-org/SDL.git"
#        GIT_TAG release-2.0.22
#)
#add_subdirectory(sdl)

add_executable(the_game_of_life
        src/main.c)
