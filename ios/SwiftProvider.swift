//
//  SwiftProvider.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/28.
//

import Foundation

class Auth : ObservableObject {
    @Published var token: String? = nil
    @Published var userid: String? = nil
    static let provider = Auth()
    private init () {
    }
}
