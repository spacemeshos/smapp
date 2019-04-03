go to https://github.com/protocolbuffers/protobuf/releases and download latest js release

unpack it and go to directory

install Xcode from the Mac AppStore

sudo xcode-select --install

sudo /opt/local/bin/port install autoconf automake libtool

git clone https://github.com/protocolbuffers/protobuf.git

cd protobuf

git submodule update --init --recursive

./autogen.sh

./configure

make

make check

sudo make install

sudo update_dyld_shared_cache # refresh shared library cache.

protoc --js_out=import_style=commonjs,binary:. api.proto
