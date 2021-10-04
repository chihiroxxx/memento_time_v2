//
//  ContentView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/25.
//

import SwiftUI

struct ContentView: View {
    @ObservedObject var auth = Auth.provider
    var body: some View {

        Group {
            if auth.token != nil {
                LoginedTabView()
            }  else {
                LoginView()
            }
        }

    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
